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

import { BarChart, LineChart } from "../components/tradeCharts";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";

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
    if (item.buyer === account) {
      transactionVolume.buy += amount;
      // check if nft was sold -> if sold, find profit
      // else set profit to 0 since nft has not been sold yet
      nftProfits[nftName] = nftProfits[nftName]
        ? nftProfits[nftName] - amount
        : 0;
      // nftBuyTimestamps[nftName] = unixTimeToDate(item.timestamp);
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
    "47D9nuQT4K8uEGMRa8YiCwnjm1v4D4BZyoRvATUgKc3w"
    // "Fbm1VcB3RmKAVh61wK7QRHs1pRc43LK9B3wBCtHCUCUf"
    // "94zDxSsYYgntjYrfL7s1Rok2Hamt11edZwZmXSjSL672"
  );

  const [rawData, setRawData] = useState<{ [key: string]: any }[]>([]);
  const [transactionData, setTransactionData] = useState<{
    [key: string]: any;
  }>({});
  const [nftData, setNftData] = useState<{ [key: string]: any }[]>([]);
  // rename to "activeJournalEntryIndex" if using index to reference
  const [activeJournalEntry, setActiveJournalEntry] = useState<number>(0);

  // use date object to get date 3 months ago
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

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
    // // only run when data is updated:
    // // compute analytics from data
    // const sourceCounts: { [key: string]: number } = {};
    // const transactionVolume = { buy: 0, sell: 0, total: 0 };

    // // it is possible for a user to repurchase an nft after selling...
    // // for this scenario, have to count transaction number on the nft.
    // const nftTransactionCount: { [key: string]: number } = {};
    // const nftProfits: { [key: string]: number } = {};

    // // const nftBuyTimestamps: { [key: string]: number } = {};
    // // const nftSellTimestamps: { [key: string]: number } = {};

    // data.forEach((item) => {
    //   const source = item.source as string;
    //   const amount = item.amount;
    //   const nftName = item.nfts[0].name;
    //   sourceCounts[source] = sourceCounts[source]
    //     ? sourceCounts[source] + 1
    //     : 1;
    //   transactionVolume.total += amount;
    //   nftTransactionCount[nftName] = nftTransactionCount[nftName]
    //     ? nftTransactionCount[nftName] + 1
    //     : 1;

    //   // transactions are ordered from latest to earliest.
    //   // nft sell event occurs before buy event.
    //   if (item.buyer === account) {
    //     transactionVolume.buy += amount;
    //     // check if nft was sold -> if sold, find profit
    //     // else set profit to 0 since nft has not been sold yet
    //     nftProfits[nftName] = nftProfits[nftName]
    //       ? nftProfits[nftName] - amount
    //       : 0;
    //   } else {
    //     // sell transaction
    //     transactionVolume.sell += amount;
    //     nftProfits[nftName] = amount;
    //   }
    // });

    // // post process parsed data:

    // // when nft transaction count is odd, nft is still in user's possession
    // // when nft transaction count is even, nft has been sold
    // // remove nft from nftProfits if nft is still in user's possession
    // Object.keys(nftTransactionCount).forEach((key) => {
    //   if (nftTransactionCount[key] % 2 !== 0) {
    //     delete nftProfits[key];
    //   }
    // });

    // // find biggest win and biggest loss
    // const [biggestWinNft, biggestWinValue] = Object.entries(nftProfits).reduce(
    //   (prev, curr) => (prev[1] >= curr[1] ? prev : curr),
    //   ["", 0]
    // );
    // const [biggestLossNft, biggestLossValue] = Object.entries(
    //   nftProfits
    // ).reduce((prev, curr) => (prev[1] <= curr[1] ? prev : curr), ["", 0]);

    // setTransactionData({
    //   ...transactionVolume,
    //   ...sourceCounts,
    //   profit: Object.values(nftProfits).reduce((prev, curr) => prev + curr, 0),
    //   wins: Object.values(nftProfits).filter((item) => item > 0).length,
    //   losses: Object.values(nftProfits).filter((item) => item < 0).length,
    //   nftFlips: Object.keys(nftProfits),
    //   nftFlipProfits: nftProfits,
    //   nftHolds: Object.keys(nftTransactionCount).filter(
    //     (item) => nftTransactionCount[item] % 2 !== 0
    //   ),
    //   biggestWin: biggestWinValue,
    //   biggestLoss: biggestLossValue,
    //   biggestWinNft,
    //   biggestLossNft,
    // });
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
              <BarChart
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

        {/* <Stack direction="row" py={8}>
          {transactionData && (
            <>
              <Stat>
                <StatLabel>Transaction Volume</StatLabel>
                <StatNumber>{transactionData.total / 1000000000}◎</StatNumber>
                {data && data.length > 0 && (
                  // ts errors that data is possibly undefined but is already caught. optional chaining used to preven error
                  <StatHelpText>
                    From {unixTimeToDateString(data.at(0)?.timestamp)} to{" "}
                    {unixTimeToDateString(data.at(-1)?.timestamp)}
                  </StatHelpText>
                )}
              </Stat>
              <Stat>
                <StatLabel>Inflow Volume</StatLabel>
                <StatNumber>{transactionData.buy / 1000000000}◎</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Outflow Volume</StatLabel>
                <StatNumber>{transactionData.sell / 1000000000}◎</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Transaction Count</StatLabel>
                <StatNumber>{data.length}</StatNumber>
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
                  {transactionData.wins} : {transactionData.losses}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Profit</StatLabel>
                <StatNumber>{transactionData.profit / 1000000000}◎</StatNumber>
              </Stat>

              {transactionData.biggestWin && (
                <Stat>
                  <StatLabel>Biggest Win</StatLabel>
                  <StatNumber>
                    {transactionData.biggestWinNft}{" "}
                    {transactionData.biggestWin / 1000000000}◎
                  </StatNumber>
                </Stat>
              )}
              {transactionData.biggestLoss && (
                <Stat>
                  <StatLabel>Biggest Loss</StatLabel>
                  <StatNumber>
                    {transactionData.biggestLossNft}{" "}
                    {transactionData.biggestLoss / 1000000000}◎
                  </StatNumber>
                </Stat>
              )}
            </>
          )}
        </Stack>

        <Stack direction="row" py={8}>
          {transactionData && (
            <>
              <Stat>
                <StatLabel>NFTs Flipped</StatLabel>
                <StatNumber>{transactionData.nftFlips?.length}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>NFTs Holding</StatLabel>
                <StatNumber>{transactionData.nftHolds?.length}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Magic Eden Transactions</StatLabel>
                <StatNumber>{transactionData.MAGIC_EDEN}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Tensor Transactions</StatLabel>
                <StatNumber>{transactionData.TENSOR}</StatNumber>
              </Stat>
            </>
          )}
        </Stack> */}

        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Hodl Bag
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <DataTable headers={["Timestamp", "NFT", "Amount"]}>
                {rawData
                  .filter((item) => {
                    const nfts = item.nfts as { [key: string]: any }[];
                    return (
                      nfts.length === 1 &&
                      transactionData.nftHolds?.includes(nfts[0].name) &&
                      unixTimeToDate(item.timestamp) < threeMonthsAgo
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
                      <Td>
                        {transactionData.nftHolds?.includes(nfts[0].name)
                          ? "Holding"
                          : "Flipped"}
                      </Td>
                      <Td>
                        <Text noOfLines={1}>
                          {/* {transactionData.nftHolds?.includes(nfts[0].name)
                          ? `nft held since ${unixTimeToDateString(
                              item.timestamp
                            )}`
                          : `nft flipped for ${
                              transactionData.nftFlipProfits?.[nfts[0].name]
                            }`} */}
                          {item.description}
                        </Text>
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
