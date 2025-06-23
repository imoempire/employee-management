import { Center, Stack, Text } from "@mantine/core";
import { IconMoodEmpty } from "@tabler/icons-react";
import React from "react";

export default function EmptyCard() {
  return (
    <div>
      <Center>
        <Stack gap={2} align="center" justify="center">
          <IconMoodEmpty color="gray" />
          <Text c="dimmed">No data available</Text>
        </Stack>
      </Center>
    </div>
  );
}
