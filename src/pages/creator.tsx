import { useState, useEffect } from "react";

import { Input, Button, Stack } from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/react";
import DataTable from "../components/dataTable";
interface Address {
  address: string;
  status: string;
}

export default function Creator() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<string>("");

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

  const handleAddAdress = () => {
    setAddresses([...addresses, { address: newAddress, status: "" }]);
    setNewAddress("");
  };

  return (
    <Stack>
      <Input type="file" onChange={handleUpload} />
      <DataTable headers={["address", "status", "tags"]}>
        {addresses.map((address) => (
          <Tr key={address.address}>
            <Td>{address.address}</Td>
            <Td>{address.status === "" ? "Not set" : address.status}</Td>
            <Td> placeholder for tags... </Td>
          </Tr>
        ))}
      </DataTable>
      <Input
        placeholder="Address"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />
      <Button onClick={handleAddAdress}>Add Address</Button>
      <Button onClick={handleDownload}>Download List as CSV</Button>
    </Stack>
  );
}
