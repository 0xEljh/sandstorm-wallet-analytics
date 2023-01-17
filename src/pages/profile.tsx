import { useState, useEffect } from "react";

import { Flex, Stack, Heading, Text } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import axios from "axios";

export default function Profile() {
  const [account, setAccount] = useState<string>("");
  const [data, setData] = useState<{ [key: string]: any }[]>([]);
  const url =
    "https://api.helius.xyz/v1/nft-events?api-key=adc13357-3e3a-478d-8d8b-352c617b9a71";

  useEffect(() => {
    axios
      .post(url, {
        query: {
          accounts: ["94zDxSsYYgntjYrfL7s1Rok2Hamt11edZwZmXSjSL672"],
          types: ["NFT_SALE"],
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        console.log(res.data.result);
        setData(res.data.result);
      });
  }, []);
  return (
    <Flex>
      <Stack>
        <Heading>Profile</Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
        </Text>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Sale Type</Th>
                <Th>Amount</Th>
                <Th>Description</Th>
                <Th>NFT</Th>
                <Th>Source</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item, index) => {
                // change item to object type
                const nfts = item.nfts as { [key: string]: any }[];
                return (
                  <Tr key={index}>
                    <Td>{item.type}</Td>
                    <Td>{item.amount / 1000000000}◎</Td>
                    <Td>
                      <Text noOfLines={1}>{item.description}</Text>
                    </Td>
                    <Td>
                      <Text noOfLines={1} maxW={32}>
                        {nfts
                          .map((nft: any, index) => nft.name)
                          .reduce(
                            (prev: string, curr: string) => prev + ", " + curr
                          )}
                      </Text>
                    </Td>
                    <Td>{item.source}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Flex>
  );
}
