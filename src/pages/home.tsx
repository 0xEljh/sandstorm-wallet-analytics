import { Flex, Stack, Heading, Text, Button } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

function TextCTAPanel({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" alignItems="center" minW={"100vw"}>
      <Text my={8}>{children}</Text>
      <Button my={8}>Get Started</Button>
    </Flex>
  );
}

export default function Home() {
  return (
    <Flex direction="column" alignItems="center">
      <Heading my={12}>
        The Ultimate Solana NFT Wallet Analytics Platform
      </Heading>
      <Text>
        We provide NFT traders, collectors, whitelist applicants and creators
        with the tools they need to track, analyze and make informed decisions.
      </Text>
      <Tabs my={8} isFitted variant="enclosed">
        <TabList>
          <Tab>Traders</Tab>
          <Tab>Collectors</Tab>
          <Tab>Whitelist Applicants</Tab>
          <Tab>Creators</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TextCTAPanel>
              View trading history and statistics. Track your performance and
              identify patterns in trading behavior. Create or join a trading
              liquidity vault for on-chain social trading.
            </TextCTAPanel>
          </TabPanel>
          <TabPanel>
            <TextCTAPanel>
              View your hodls, collection value, and performance. Showcase your
              ability to curate and collect NFTs.
            </TextCTAPanel>
          </TabPanel>
          <TabPanel>
            <TextCTAPanel>
              View and apply for NFT whitelists. Make your case to NFT projects.
              Showcase your ability as a collector, trader, or both.
            </TextCTAPanel>
          </TabPanel>
          <TabPanel>
            <TextCTAPanel>
              Curate a whitelist of applicants based on your desired holder
              profile. Choose applicants that will be the most valuable to your
              project.
            </TextCTAPanel>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
