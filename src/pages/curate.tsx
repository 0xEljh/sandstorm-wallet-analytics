import { useState, useEffect } from "react";

import { Flex, Stack, Heading, Text } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import axios from "axios";

export default function Curate() {
  const [data, setData] = useState([]);
  const url =
    "https://api.helius.xyz/v1/nft-events?api-key=adc13357-3e3a-478d-8d8b-352c617b9a71";

  useEffect(() => {
    axios
      .post(url, {
        query: {
          accounts: ["BAAzgRGWY2v5AJBNZNFd2abiRXAUo56UxywKEjoCZW2"],
          types: ["NFT_SALE"],
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        console.log(res.data);
        setData(res.data);
      });
  }, []);
  return (
    <Flex>
      <Stack>
        <Heading>Curate</Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
        </Text>
      </Stack>
    </Flex>
  );
}
