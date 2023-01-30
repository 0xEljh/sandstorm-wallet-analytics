import { useState, useEffect } from "react";
import axios from "axios";

import { Flex, Stack, Heading, Text, Box } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/react";
import DataTable from "../components/dataTable";

import { ScatterChart, LineChart } from "../components/tradeCharts";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

import { unixTimeToDateString, unixTimeToDate } from "../utils/timeConversion";

function parseData(data: { [key: string]: any }[], account: string) {
  // iterate through data and parse it for metadata
  // metadata includes: source, transaction volume,
  const sourceCounts: { [key: string]: number } = {};
  const transactionVolume = { buy: 0, sell: 0, total: 0 };

  // gather also nft data:
  // it is possible for a user to repurchase an nft after selling...
  // for this scenario, have to count transaction number on the nft.
  const nftTransactionCount: { [key: string]: number } = {};
  const nftProfits: { [key: string]: number } = {};
  const nftBuyTimestamps: { [key: string]: Date } = {};
  const nftSellTimestamps: { [key: string]: Date } = {};

  data.forEach((item) => {
    const source = item.source as string;
    const amount = item.amount;
    const nftName = item.nfts[0].name;
    sourceCounts[source] = sourceCounts[source] ? sourceCounts[source] + 1 : 1;
    transactionVolume.total += amount;
    nftTransactionCount[nftName] = nftTransactionCount[nftName]
      ? nftTransactionCount[nftName] + 1
      : 1;

    // transactions are ordered from latest to earliest.
    // nft sell event occurs before buy event.
    if (item.buyer === account || item.type === "NFT_MINT") {
      // treat nft mint as a buy event for transaction purposes
      transactionVolume.buy += amount;
      // check if nft was sold -> if sold, find profit
      // else set profit to 0 since nft has not been sold yet
      nftProfits[nftName] = nftProfits[nftName]
        ? nftProfits[nftName] - amount
        : 0;
      nftBuyTimestamps[nftName] = item.timestamp;
    } else {
      // sell transaction
      transactionVolume.sell += amount;
      nftProfits[nftName] = amount;
      // nftSellTimestamps[nftName] = unixTimeToDate(item.timestamp);
      nftSellTimestamps[nftName] = item.timestamp;
    }
  });

  // nft data into array of objects:
  const nftData = Object.keys(nftTransactionCount).map((key) => {
    return {
      name: key,
      transactionCount: nftTransactionCount[key],
      profit: nftProfits[key],
      buyTimestamp: nftBuyTimestamps[key],
      sellTimestamp: nftSellTimestamps[key],
    };
  });
  // if transaction count is odd, nft is still owned by user.

  return { nftData, sourceCounts, transactionVolume };
}

export default function Profile() {
  const [account, setAccount] = useState<string>(
    // "47D9nuQT4K8uEGMRa8YiCwnjm1v4D4BZyoRvATUgKc3w"
    "Fbm1VcB3RmKAVh61wK7QRHs1pRc43LK9B3wBCtHCUCUf"
    // "94zDxSsYYgntjYrfL7s1Rok2Hamt11edZwZmXSjSL672"
  );

  const [rawData, setRawData] = useState<{ [key: string]: any }[]>([]);
  const [transactionData, setTransactionData] = useState<{
    [key: string]: any;
  }>({});
  const [nftData, setNftData] = useState<{ [key: string]: any }[]>([]);
  // rename to "activeJournalEntryIndex" if using index to reference
  const [activeJournalEntry, setActiveJournalEntry] = useState<number>(0);

  // use date object to get date X months ago. X = 3, 6, 12
  const date = new Date();
  date.setMonth(date.getMonth() - 3);

  // will need to redact api key
  const url =
    "https://api.helius.xyz/v1/nft-events?api-key=adc13357-3e3a-478d-8d8b-352c617b9a71";

  useEffect(() => {
    axios
      .post(url, {
        query: {
          accounts: [account],
          types: ["NFT_SALE", "NFT_MINT"],
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        console.log(res.data.result);
        setRawData(res.data.result);
      });
  }, [account]);

  // perform analytics based on the data
  // e.g. favorite NFT. total purchase, total sales, etc.
  useEffect(() => {
    const { nftData, transactionVolume, sourceCounts } = parseData(
      rawData,
      account
    );
    setTransactionData({ ...transactionVolume, ...sourceCounts });
    setNftData(nftData);
  }, [rawData, account]);

  return (
    <Flex>
      <Stack>
        <Heading>Profile: {account}</Heading>

        <Stack direction="row" py={8}>
          {nftData && (
            <>
              <ScatterChart
                data={nftData.filter(
                  (x) =>
                    x.sellTimestamp !== undefined &&
                    x.transactionCount % 2 === 0
                )}
                x="sellTimestamp"
                y="profit"
              />
            </>
          )}
        </Stack>

        <Stack direction="row" py={8}>
          {transactionData && (
            <>
              <Stat>
                <StatLabel>Transaction Volume</StatLabel>
                <StatNumber>
                  {(transactionData.total / 1000000000).toFixed(2)}◎
                </StatNumber>
                {nftData && nftData.length > 0 && (
                  // ts errors that data is possibly undefined but is already caught. optional chaining used to preven error
                  <StatHelpText>
                    From {unixTimeToDateString(nftData.at(0)?.buyTimestamp)}
                  </StatHelpText>
                )}
              </Stat>
              <Stat>
                <StatLabel>Inflow Volume</StatLabel>
                <StatNumber>
                  {(transactionData.buy / 1000000000).toFixed(2)}◎
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Outflow Volume</StatLabel>
                <StatNumber>
                  {(transactionData.sell / 1000000000).toFixed(2)}◎
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>NFTs transacted</StatLabel>
                <StatNumber>{nftData.length}</StatNumber>
              </Stat>
            </>
          )}
        </Stack>
        <Stack direction="row" py={8}>
          {transactionData && (
            <>
              <Stat>
                <StatLabel>Win Rate</StatLabel>
                <StatNumber>
                  {nftData?.filter((datum) => datum.profit > 0).length} :{" "}
                  {nftData?.filter((datum) => datum.profit < 0).length}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Total Profit</StatLabel>
                <StatNumber>
                  {(
                    nftData
                      .map((datum) => datum.profit)
                      .reduce((prev, curr) => prev + curr, 0) / 1000000000
                  ).toFixed(2)}
                  ◎
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Biggest SOL Win</StatLabel>
                {nftData.length > 0 && (
                  <>
                    <StatNumber>
                      {
                        nftData.reduce((prev, curr) =>
                          prev.profit > curr.profit ? prev : curr
                        ).name
                      }
                    </StatNumber>

                    <StatNumber>
                      {(
                        nftData.reduce((prev, curr) =>
                          prev.profit > curr.profit ? prev : curr
                        ).profit / 1000000000
                      ).toFixed(2)}
                      {""}◎
                    </StatNumber>
                    <StatArrow type="increase" />
                  </>
                )}
              </Stat>

              <Stat>
                <StatLabel>Biggest SOL Loss</StatLabel>
                {nftData.length > 0 && (
                  <>
                    <StatNumber>
                      {
                        nftData.reduce((prev, curr) =>
                          prev.profit < curr.profit ? prev : curr
                        ).name
                      }
                    </StatNumber>
                    <StatNumber>
                      {(
                        nftData.reduce((prev, curr) =>
                          prev.profit < curr.profit ? prev : curr
                        ).profit / 1000000000
                      ).toFixed(2)}
                      {""}◎
                    </StatNumber>
                    <StatArrow type="decrease" />
                  </>
                )}
              </Stat>
            </>
          )}
        </Stack>

        <Stack direction="row" py={8}>
          {transactionData && (
            <>
              <Stat>
                <StatLabel>Flipped</StatLabel>
                <StatNumber>
                  {
                    nftData.filter((datum) => datum.transactionCount % 2 === 0)
                      .length
                  }
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Holding</StatLabel>
                <StatNumber>
                  {
                    nftData.filter((datum) => datum.transactionCount % 2 === 1)
                      .length
                  }
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Mints</StatLabel>
                <StatNumber>
                  {rawData.filter((datum) => datum.type === "NFT_MINT").length}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Magic Eden Transactions</StatLabel>
                <StatNumber>{transactionData.MAGIC_EDEN}</StatNumber>
              </Stat>
            </>
          )}
        </Stack>

        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Current holds
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <DataTable headers={["Timestamp", "NFT", "Amount"]}>
                {rawData
                  .filter((item) => {
                    const nfts = item.nfts as { [key: string]: any }[];
                    return nfts.length === 1;
                  })
                  .map((item, index) => {
                    // change item to object type
                    const nfts = item.nfts as { [key: string]: any }[];
                    return (
                      <Tr key={index}>
                        <Td>{unixTimeToDateString(item.timestamp)}</Td>
                        <Td>
                          <Text>
                            {nfts
                              .map((nft: any) => nft.name)
                              .reduce(
                                (prev: string, curr: string) =>
                                  prev + ", " + curr
                              )}
                          </Text>
                        </Td>
                        <Td>{item.amount / 1000000000}◎</Td>
                      </Tr>
                    );
                  })}
              </DataTable>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                HODLs (held for more than 3 months)
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <DataTable headers={["Timestamp", "NFT", "Amount"]}>
                {rawData
                  .filter((item) => {
                    const nfts = item.nfts as { [key: string]: any }[];
                    return (
                      nfts.length === 1 && unixTimeToDate(item.timestamp) < date
                    );
                  })
                  .map((item, index) => {
                    // change item to object type
                    const nfts = item.nfts as { [key: string]: any }[];
                    return (
                      <Tr key={index}>
                        <Td>{unixTimeToDateString(item.timestamp)}</Td>
                        <Td>
                          <Text>
                            {nfts
                              .map((nft: any) => nft.name)
                              .reduce(
                                (prev: string, curr: string) =>
                                  prev + ", " + curr
                              )}
                          </Text>
                        </Td>
                        <Td>{item.amount / 1000000000}◎</Td>
                      </Tr>
                    );
                  })}
              </DataTable>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Raw Data
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <DataTable
                headers={["Timestamp", "NFT", "Amount", "Type", "Description"]}
              >
                {rawData.map((item, index) => {
                  // change item to object type
                  const nfts = item.nfts as { [key: string]: any }[];
                  return (
                    <Tr key={index}>
                      <Td>{unixTimeToDateString(item.timestamp)}</Td>
                      <Td>
                        <Text>
                          {nfts
                            .map((nft: any, index) => nft.name)
                            .reduce(
                              (prev: string, curr: string) => prev + ", " + curr
                            )}
                        </Text>
                      </Td>
                      <Td>{item.amount / 1000000000}◎</Td>
                      <Td>{item.type}</Td>
                      <Td>
                        <Text noOfLines={1}>{item.description}</Text>
                      </Td>
                    </Tr>
                  );
                })}
              </DataTable>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </Flex>
  );
}
