import {
  ActionIcon,
  Center,
  Group,
  Paper,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconDownload, IconEye, IconMoodEmpty } from "@tabler/icons-react";
import React from "react";

export default function PolicyTable() {
  const documents: {
    policyTitle: string;
    category: string;
    lastUpdatedDate: string;
    status: string;
  }[] = [];

  const rows = documents?.map((document, index) => (
    <Table.Tr key={index}>
      <Table.Td>{document.policyTitle}</Table.Td>
      <Table.Td>{document.category}</Table.Td>
      <Table.Td>{document.lastUpdatedDate}</Table.Td>
      <Table.Td>{document.status}</Table.Td>
      <Table.Td>
        <Group gap={0}>
          <ActionIcon c={"dark"} variant="subtle" size="xl">
            <IconEye />
          </ActionIcon>
          <ActionIcon c={"dark"} variant="subtle" size="xl">
            <IconDownload />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex flex-col gap-y-4">
      <Paper>
        <Table verticalSpacing="md">
          <Table.Thead style={{ backgroundColor: "#054EFA", color: "white" }}>
            <Table.Tr>
              <Table.Th>Policy Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Last Updated Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {documents.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                  <Center>
                    <Stack gap={2} align="center" justify="center" >
                      <IconMoodEmpty color="gray" />
                      <Text c="dimmed">No data available</Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
