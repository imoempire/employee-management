import EmptyCard from "@/components/EmptyCard";
import { Button, Card, Group, Text } from "@mantine/core";
import { IconPlayerPlay, IconPointFilled } from "@tabler/icons-react";
import React from "react";

export default function OnboardingMaterials() {
  const onboardingMaterials: {
    id: string;
    title: string;
    description: string;
    type: string;
    fileSize: string;
  }[] = [];
  return (
    <div>
      {onboardingMaterials?.length === 0 && <EmptyCard />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {onboardingMaterials.map((material) => {
          return (
            <Card
              key={material.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between" mt="md" mb="xs">
                <Text fs="80" fw={700}>
                  {material.title}
                </Text>
              </Group>

              <Text size="sm" fw={500} c="#64748B">
                {material.description}
              </Text>

              <Group mt="xl" w="100%" justify="space-between" align="center">
                <Group align="center" gap={2}>
                  <Text size="sm" c="#64748B">
                    {material.type}
                  </Text>
                  <IconPointFilled color="#64748B" size={10} />
                  <Text size="sm" c="#64748B">
                    {material.fileSize}
                  </Text>
                </Group>
                <Button
                  leftSection={<IconPlayerPlay />}
                  color="dark"
                  radius="md"
                >
                  Download
                </Button>
              </Group>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
