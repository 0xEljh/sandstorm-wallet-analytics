import { useState, useEffect } from "react";

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
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";

import { FaSearch } from "react-icons/fa";
import { Icon } from "@chakra-ui/react";

import fetchWalletData from "../utils/fetchWalletData";
import { unixTimeToDateString, unixTimeToDate } from "../utils/timeConversion";
import parseWalletData from "../utils/parseWalletData";
import { getWinLossData, getWalletTags } from "../utils/walletAnalytics";
import { lampToSol } from "../utils/currencyConversion";
import { logPageView, logClick, logSearch } from "../utils/logging";

import TagStack from "../components/tagStack";
import Footer from "../components/footer";

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
    ""
  );

  const [rawData, setRawData] = useState<{ [key: string]: any }[]>([]);
  const [transactionData, setTransactionData] = useState<{
    [key: string]: any;
  }>({});
  const [nftData, setNftData] = useState<{ [key: string]: any }[]>([]);
  const [nftHodlData, setNftHodlData] = useState<{ [key: string]: any }[]>([]);
  const [winLossData, setWinLossData] = useState<{ [key: string]: number }>({
    wins: 0,
    losses: 0,
    profit: 0,
    hodls: 0,
  });

  // use date object to get date X months ago. X = 3, 6, 12
  // todo: make this dynamic for user to select
  const date = new Date();
  date.setMonth(date.getMonth() - 3);

  useEffect(() => {
    logPageView("profile");
  }, []);

  useEffect(() => {
    fetchWalletData(account).then((res) => {
      setRawData(res);
    });
  }, [account]);

  // perform analytics based on the data
  // e.g. favorite NFT. total purchase, total sales, etc.
  useEffect(() => {
    const { nftData, nftHodlData, transactionVolume, sourceCounts } =
      parseWalletData(rawData, account);
    setTransactionData({ ...transactionVolume, ...sourceCounts });
    setNftData(nftData);
    setNftHodlData(nftHodlData);
    setWinLossData(getWinLossData(nftData, nftHodlData));
  }, [rawData, account]);

  function handleAccountChange(e: any) {
    if (e.target.value.length < 32) return;
    setAccount(e.target.value);
    logSearch(e.target.value);
  }

  return (
    <Flex direction="column">
      <Stack spacing={8} my={8} mx={[4, 8, 12]}>
        <Heading>Profile</Heading>
        <InputGroup my={8}>
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={FaSearch} color="brand.200" />}
          />
          <Input
            type="text"
            placeholder="Enter Solana Address"
            onChange={handleAccountChange}
          />
        </InputGroup>

        <TagStack tags={getWalletTags(nftData, nftHodlData, transactionData)} />
      </Stack>
      {nftData && (
        <Box maxW={["100%", "100%", "80vw"]} ml={[0, 0, "10vw"]}>
          <ScatterChart
            data={nftData.filter(
              (x) =>
                x.sellTimestamp !== undefined && x.transactionCount % 2 === 0
            )}
            x="sellTimestamp"
            y="profit"
          />
        </Box>
      )}

      <Stack direction="row" py={8} mx={[4, 8, 12]}>
        <Stat>
          <StatLabel>Transaction Volume</StatLabel>
          <StatNumber>
            {lampToSol(transactionData.total).toFixed(2)}???
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
            {lampToSol(transactionData.inflow).toFixed(2)}???
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Outflow Volume</StatLabel>
          <StatNumber>
            {lampToSol(transactionData.outflow).toFixed(2)}???
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Net Volume</StatLabel>
          <StatNumber>
            {lampToSol(
              transactionData.inflow - transactionData.outflow
            ).toFixed(2)}
            ???
          </StatNumber>
          <StatHelpText>Net Ecosystem Inflow</StatHelpText>
        </Stat>
      </Stack>
      <Stack direction="row" py={8} mx={[4, 8, 12]}>
        <Stat>
          <StatLabel>Win Rate</StatLabel>
          <StatNumber>
            {winLossData.wins} : {winLossData.losses}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Profit</StatLabel>
          <StatNumber>{lampToSol(winLossData.profit).toFixed(2)}???</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Biggest SOL Win</StatLabel>
          {nftData.length > 0 && (
            <>
              <StatNumber>
                {lampToSol(
                  nftData.reduce((prev, curr) =>
                    prev.profit > curr.profit ? prev : curr
                  ).profit
                ).toFixed(2)}
                {""}???
              </StatNumber>
              <StatHelpText>
                {
                  nftData.reduce((prev, curr) =>
                    prev.profit > curr.profit ? prev : curr
                  ).name
                }
              </StatHelpText>
            </>
          )}
        </Stat>

        <Stat>
          <StatLabel>Biggest SOL Loss</StatLabel>
          {nftData.length > 0 && (
            <>
              <StatNumber>
                {lampToSol(
                  nftData.reduce((prev, curr) =>
                    prev.profit < curr.profit ? prev : curr
                  ).profit
                ).toFixed(2)}
                {""}???
              </StatNumber>
              <StatHelpText>
                {
                  nftData.reduce((prev, curr) =>
                    prev.profit < curr.profit ? prev : curr
                  ).name
                }
              </StatHelpText>
            </>
          )}
        </Stat>
      </Stack>

      <Stack direction="row" py={8} mx={[4, 8, 12]}>
        <Stat>
          <StatLabel>Flips</StatLabel>
          <StatNumber>{winLossData.wins + winLossData.losses}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>HODLs</StatLabel>
          <StatNumber>{winLossData.hodls}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Mints</StatLabel>
          <StatNumber>{transactionData.mint ?? 0}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Magic Eden Transactions</StatLabel>
          <StatNumber>{transactionData.MAGIC_EDEN ?? 0}</StatNumber>
        </Stat>
      </Stack>

      <Accordion allowToggle my={24} mx={[4, 8, 12]}>
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
                    <Td>{item.amount / 1000000000}???</Td>
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
      <Footer />
    </Flex>
  );
}
