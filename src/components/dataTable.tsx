import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";

export default function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <TableContainer>
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{children}</Tbody>
      </Table>
    </TableContainer>
  );
}
