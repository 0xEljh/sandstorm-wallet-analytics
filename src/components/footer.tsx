import { Flex, Link, Text, Icon, Spacer } from "@chakra-ui/react";
import { SiTwitter, SiGithub, SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <Flex as="footer" bg="brand.0" p={5}>
      <Text fontSize="sm" color="brand.200" mr={2}>
        Made with ❤️ by 0xEljh. Any and all feedback is welcome.
      </Text>
      <Spacer />
      <Link href="https://twitter.com/0xEljh" isExternal>
        <Icon as={SiTwitter} color="brand.400" mr={2} />
      </Link>
      <Link href="mailto:elijahng96@gmail.com" isExternal>
        <Icon as={SiGmail} color="brand.400" mr={2} />
      </Link>
      <Link
        href="https://github.com/0xEljh/sandstorm-wallet-analytics"
        isExternal
      >
        <Icon as={SiGithub} color="brand.400" mr={2} />
      </Link>
    </Flex>
  );
}
