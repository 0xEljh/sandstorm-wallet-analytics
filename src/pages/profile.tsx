import { useState, useEffect } from "react";
import axios from "axios";

import { Flex, Stack, Heading, Text, Box } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/react";
import DataTable from "../components/dataTable";

import { ScatterChart } from "../components/tradeCharts";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

import { FaSearch } from "react-icons/fa";
import { Icon } from "@chakra-ui/react";

import { unixTimeToDateString, unixTimeToDate } from "../utils/timeConversion";
import parseWalletData from "../utils/parseWalletData";
import { lampToSol } from "../utils/currencyConversion";
import TagStack from "../components/tagStack";

function DataRow({ data }: { data: { [key: string]: any } }) {
  return (
    <Tr>
      <Td>{data.name}</Td>
      {/* <Td>{data.symbol}</Td> */}
      <Td>{lampToSol(data.buyPrice)}</Td>
      <Td>{unixTimeToDateString(data.buyTimestamp)}</Td>
    </Tr>
  );
}

export default function Profile() {
  const [account, setAccount] = useState<string>(
    // "47D9nuQT4K8uEGMRa8YiCwnjm1v4D4BZyoRvATUgKc3w"
    // "Fbm1VcB3RmKAVh61wK7QRHs1pRc43LK9B3wBCtHCUCUf"
    // "94zDxSsYYgntjYrfL7s1Rok2Hamt11edZwZmXSjSL672"
    ""
  );

  const [rawData, setRawData] = useState<{ [key: string]: any }[]>([]);
  const [transactionData, setTransactionData] = useState<{
    [key: string]: any;
  }>({});
  const [nftData, setNftData] = useState<{ [key: string]: any }[]>([]);
  const [nftHodlData, setNftHodlData] = useState<{ [key: string]: any }[]>([]);

  // use date object to get date X months ago. X = 3, 6, 12
  const date = new Date();
  date.setMonth(date.getMonth() - 3);

  useEffect(() => {
    // get nft data from helius api
    // will need to redact api key
    const url =
      "https://api.helius.xyz/v1/nft-events?api-key=adc13357-3e3a-478d-8d8b-352c617b9a71";
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
        setRawData(res.data.result);
      });
  }, [account]);

  // perform analytics based on the data
  // e.g. favorite NFT. total purchase, total sales, etc.
  useEffect(() => {
    const { nftData, transactionVolume, sourceCounts } = parseWalletData(
      rawData,
      account
    );
    setTransactionData({ ...transactionVolume, ...sourceCounts });
    setNftData(nftData);
    setNftHodlData(
      nftData.filter(
        (datum) =>
          datum.transactionCount % 2 === 1 &&
          ((datum.profit === 0 && datum.sellTimestamp === undefined) ||
            datum.transactionCount > 2)
      )
    );
  }, [rawData, account]);

  function handleAccountChange(e: any) {
    if (e.target.value.length < 32) return;
    setAccount(e.target.value);
  }

  return (
    <Flex direction="column">
      <Heading>Profile</Heading>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={FaSearch} color="gray.300" />}
        />
        <Input
          type="text"
          placeholder="Enter Solana Address"
          onChange={handleAccountChange}
        />
      </InputGroup>

      <TagStack
        tags={[
          "flipper",
          "minter",
          "whale",
          "connoisseur",
          "diamond_hands",
          "nftgod",
        ]}
        py={12}
      />

      <Stack direction="row" py={8}>
        {nftData && (
          <>
            <ScatterChart
              data={nftData.filter(
                (x) =>
                  x.sellTimestamp !== undefined && x.transactionCount % 2 === 0
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
                {lampToSol(transactionData.total).toFixed(2)}◎
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
                {lampToSol(transactionData.buy).toFixed(2)}◎
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Outflow Volume</StatLabel>
              <StatNumber>
                {lampToSol(transactionData.sell).toFixed(2)}◎
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Net Volume</StatLabel>
              <StatNumber>
                {lampToSol(transactionData.buy - transactionData.sell).toFixed(
                  2
                )}
                ◎
              </StatNumber>
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
                {lampToSol(
                  nftData
                    .map((datum) => datum.profit)
                    .reduce((prev, curr) => prev + curr, 0)
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
                    {lampToSol(
                      nftData.reduce((prev, curr) =>
                        prev.profit > curr.profit ? prev : curr
                      ).profit
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
                    {lampToSol(
                      nftData.reduce((prev, curr) =>
                        prev.profit < curr.profit ? prev : curr
                      ).profit
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
              <StatNumber>{nftHodlData.length}</StatNumber>
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
            <DataTable headers={["NFT", "Purchase Price", "Purchase Date"]}>
              {nftHodlData.map((item, index) => {
                return <DataRow data={item} />;
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
            <DataTable headers={["NFT", "Purchase Price", "Purchase Date"]}>
              {nftHodlData
                .filter((datum) => unixTimeToDate(datum.buyTimestamp) < date)
                .map((item, index) => {
                  return <DataRow data={item} />;
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
    </Flex>
  );
}
