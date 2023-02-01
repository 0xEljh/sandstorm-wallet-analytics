import { Stack, Flex } from "@chakra-ui/react";
import {
  FlipperTag,
  MinterTag,
  ConnoisseurTag,
  WhaleTag,
  DiamondHandsTag,
  NFTGODTag,
} from "./tags";

interface TagStackProps {
  tags: string[];
  [key: string]: any;
}

export default function TagStack({ tags, ...props }: TagStackProps) {
  return (
    <Stack direction="row" spacing={2} {...props}>
      {tags.includes("flipper") && <FlipperTag />}
      {tags.includes("minter") && <MinterTag />}
      {tags.includes("connoisseur") && <ConnoisseurTag />}
      {tags.includes("whale") && <WhaleTag />}
      {tags.includes("diamond_hands") && <DiamondHandsTag />}
      {tags.includes("nft_god") && <NFTGODTag />}
    </Stack>
  );
}
