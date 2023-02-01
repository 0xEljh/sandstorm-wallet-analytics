import { useState, useEffect } from "react";

import {
  Input,
  Button,
  Select,
  Stack,
  Heading,
  Text,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { Tr, Td } from "@chakra-ui/react";
import DataTable from "../components/dataTable";

interface Address {
  address: string;
  status: string;
}

export default function Creator() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<string>("");
  const [hasAddressError, setHasAddressError] = useState<boolean>(false);

  useEffect(() => {
    const storedAddresses = localStorage.getItem("addresses");
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
    console.log(localStorage);
  }, [addresses]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      if (event.target === null) return;

      const lines = (event.target as any).result.split("\n");
      const newAddresses = lines.map((line: string) => ({
        address: line,
        status: "",
      }));
      setAddresses([...addresses, ...newAddresses]);
    };
  };
  const handleDownload = () => {
    const csv = addresses
      .map((address) => `${address.address},${address.status}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "whitelist.csv";
    link.click();
  };

  const handleAddAddress = () => {
    if (newAddress.length < 32) {
      setHasAddressError(true);
      return;
    }
    setAddresses([...addresses, { address: newAddress, status: "" }]);
    setNewAddress("");
    setHasAddressError(false);
  };

  const handleDeleteAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleUpdateStatus = (index: number, status: string) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].status = status;
    setAddresses(updatedAddresses);
  };

  return (
    <Stack spacing={8}>
      <Heading>Whitelist</Heading>
      <DataTable headers={["Address", "Tags", "Status", "Modify"]}>
        {addresses.map((address, index) => (
          <Tr key={index}>
            <Td>{address.address}</Td>
            <Td> placeholder for tags... </Td>
            <Td>
              <Select
                placeholder="Not Set"
                value={address.status}
                onChange={(e) => handleUpdateStatus(index, e.target.value)}
              >
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="considering">Considering</option>
              </Select>
            </Td>
            <Td>
              <IconButton
                onClick={() => handleDeleteAddress(index)}
                aria-label="delete"
                icon={<Icon as={MdDelete} />}
              />
            </Td>
          </Tr>
        ))}
      </DataTable>
      <Button onClick={handleDownload}>Download List as CSV</Button>
      <Stack>
        <Heading size="lg">Add Address</Heading>
        <Input
          placeholder="Address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        {hasAddressError && (
          <Text color="red">Address must be at least 32 characters</Text>
        )}
        <Button onClick={handleAddAddress}>Add Address</Button>
        <Input type="file" onChange={handleUpload} />
      </Stack>
    </Stack>
  );
}
