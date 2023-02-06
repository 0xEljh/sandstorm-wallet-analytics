import { Button, IconButton, Icon } from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";

export function WalletButton({ ...props }: { [key: string]: any }) {
  return (
    <IconButton aria-label="wallet" icon={<Icon as={FaWallet} />} {...props} />
  );
}

export function CTAButton({
  text,
  ...props
}: {
  text: string;
  [key: string]: any;
}) {
  return <Button {...props}>{text}</Button>;
}
