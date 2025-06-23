import React from "react";
import { Card, Group, Progress, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";

export default function Handheld() {
  const Data = [
    { name: "Handheld Basics", video: "2 videos available" },
    { name: "Audio Setup", video: "2 videos available" },
    { name: "Lighting", video: "2 videos available" },
    { name: "Recording Techniques", video: "2 videos available" },
    {
      name: "Post Production",
      video: "2 videos available",
    },
  ];

  return (
    <div>
      {/* <div className="flex flex-col md:gap-1 mb-2">
        <Text fz={25} fw={600}>
          Consumer Drones Training
        </Text>
        <Text fz={15} fw={400} c={"#64748b"}>
          Learn everything about consumer drone operation and maintenance
        </Text>
      </div> */}
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Data.map((item, index) => {
            return (
              <Card key={index} shadow="sm" radius="md" withBorder pb={60}>
                <Group gap={6}>
                  <IconFolder stroke={1.5} size={60} />
                  <Text fz="20" fw={700}>
                    {item?.name}
                  </Text>
                </Group>

                <div>
                  <Progress mt={"md"} value={0} h={15} radius={10} />
                </div>

                <Text mt={"md"} fz="20" fw={500} c="#64748B">
                  {item?.video}
                </Text>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
