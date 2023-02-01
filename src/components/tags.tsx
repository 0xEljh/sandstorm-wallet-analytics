import { Tag, TagLabel, TagLeftIcon, TagRightIcon } from "@chakra-ui/react";
import { FaChartLine, FaCoins, FaHammer, FaPalette } from "react-icons/fa";
import { GiClown, GiCutDiamond } from "react-icons/gi";

interface TagWithIconProps {
  label: string;
  icon: any;
  [key: string]: any;
}

function TagWithIcon({ label, icon, ...props }: TagWithIconProps) {
  return (
    <Tag {...props} size="lg">
      <TagLeftIcon as={icon} />
      <TagLabel>{label}</TagLabel>
    </Tag>
  );
}

export function FlipperTag() {
  return (
    <TagWithIcon
      label="Flipper"
      icon={FaChartLine}
      colorScheme="purple"
      variant="solid"
    />
  );
}

export function MinterTag() {
  return (
    <TagWithIcon
      label="Minter"
      icon={FaHammer}
      colorScheme="yellow"
      variant="solid"
    />
  );
}

export function ConnoisseurTag() {
  return (
    <TagWithIcon
      label="Connoisseur"
      icon={FaPalette}
      colorScheme="teal"
      variant="solid"
    />
  );
}

export function WhaleTag() {
  return (
    <TagWithIcon
      label="Whale"
      icon={FaCoins}
      colorScheme="blue"
      variant="solid"
    />
  );
}

export function DiamondHandsTag() {
  return (
    <TagWithIcon
      label="Diamond Hands"
      icon={GiCutDiamond}
      colorScheme="cyan"
      variant="solid"
    />
  );
}

export function NFTGODTag() {
  return (
    <TagWithIcon
      label="NFT_GOD"
      icon={GiClown}
      colorScheme="red"
      variant="solid"
    />
  );
}
