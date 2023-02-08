import { useEffect } from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { CTAButton } from "../components/buttons";
import Footer from "../components/footer";

import { logPageView, logClick } from "../utils/logging";

function TextCTAPanel({
  link,
  title,
  children,
}: {
  link: string;
  title: string;
  children: React.ReactNode;
}) {
  // button should link to /internal-link
  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Text fontSize="lg" my={12} align="center" mx={4}>
        {children}
      </Text>
      <Link to={link}>
        <CTAButton
          size="lg"
          text="Launch App"
          my={12}
          onClick={() => logClick(title)}
        />
      </Link>
    </Flex>
  );
}

export default function Home() {
  useEffect(() => {
    logPageView("home");
  }, []);

  return (
    <Flex direction="column" alignItems="center">
      {/* @ts-ignore-next align is a prop on Heading but not recognised*/}
      <Heading mt={["20%", "10%"]} mx={[12, 24]} align="center">
        Find LARPs, Diamond Handers, or Flipooors on Solana NFTs with Analytics
      </Heading>
      <Text color="brand.400" my={24} mx={[8, 12]} fontSize="lg" align="center">
        We provide wallet analytics for NFT traders, collectors, and creators so
        they can make data-driven decisions (e.g. who to whitelist or
        copy-trade) and showcase their NFT trading and collecting abilities.
        <br />
        An app for NFT enjoyooors.
      </Text>
      <Tabs my={8} pb={12} isFitted width={"90vw"}>
        <TabList>
          <Tab>Traders</Tab>
          <Tab>Collectors</Tab>
          <Tab>Creators</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TextCTAPanel link="/profile" title="traders">
              View trading history and statistics. Track your performance and
              identify patterns in trading behavior.
              <br /> Look up other traders and see what they are holding or
              buying. Verify the performance of Alpha Callers and spot LARPers.
            </TextCTAPanel>
          </TabPanel>
          <TabPanel>
            <TextCTAPanel link="/profile" title="collectors">
              View your hodls, collection value, and performance. Showcase your
              ability to curate, mint, and collect NFTs. Make your case to NFT
              projects when applying for whitelists.
            </TextCTAPanel>
          </TabPanel>
          <TabPanel>
            <TextCTAPanel link="/creator" title="creators">
              Curate a whitelist of applicants based on hard data and your
              desired holder profile.
              <br />
              Choose applicants that will be the most valuable to your project
              and community.
            </TextCTAPanel>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Footer />
    </Flex>
  );
}
