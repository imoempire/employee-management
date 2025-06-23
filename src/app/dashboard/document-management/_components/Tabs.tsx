import { Card, Divider, Group, Stack, Tabs, Text } from "@mantine/core";
import {
  IconXboxX,
  IconRosetteDiscountCheck,
  IconClock,
  IconFolder,
  IconFiles,
} from "@tabler/icons-react";

export function DocsManagementsTab() {
  const CardsData: {
    title: string;
    subtitle: string;
    count?: string;
    color: string;
    Icon: React.ReactNode;
  }[] = [
    {
      title: "Total Documents",
      subtitle: "0 uploaded documents",
      // count: "0",
      color: "#054EFA",
      Icon: <IconFolder size={70} color="white" />,
    },
    {
      title: "Pending Documents",
      subtitle: "You have 0 pending",
      color: "#228039",
      Icon: <IconClock size={70} color="white" />,
    },
    {
      title: "Verified Documents",
      subtitle: "0 Verified Documents",
      color: "#FA9005",
      Icon: <IconRosetteDiscountCheck size={70} color="white" />,
    },
    {
      title: "Verified Documents",
      subtitle: "0 Verified Documents",
      color: "#FA9005",
      Icon: <IconXboxX size={70} color="white" />,
    },
  ];

  return (
    <Tabs variant="pills" radius="xl" color="#054EFA" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery" leftSection={<IconFiles size={20} />}>
          My Documents
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 mt-16">
          {CardsData?.map((card, index) => {
            return (
              <Card
                key={index}
                shadow="sm"
                padding="xl"
                radius="40"
                bg={"#0039C8"}
                className="text-white"
              >
                <Stack>
                  <Group gap="xs">
                    {card.Icon}
                    <Stack gap={0}>
                      <Text c={"#ffffff"} size="md">
                        {card.title}
                      </Text>
                      <Text c={"#ffffff"} size="sm">
                        {card?.count && card.count} {card.subtitle}
                      </Text>
                    </Stack>
                  </Group>
                  <Divider size={6} color="#00000047" />
                </Stack>
              </Card>
            );
          })}
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}
