import React from "react";
import { Card, Group, Progress, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { FolderResponse } from "./types";
import { useCustomGet } from "@/Hooks/useCustomGet";

export default function Drones() {
  const router = useRouter();
  const pathname = usePathname();

  // DATA API
  const { data: dronesFolder } = useCustomGet<FolderResponse>({
    url: `https://erp.mawuena.com/api/admin/consumer-folder/list`,
  });


  const Data = dronesFolder?.folders || [];

  return (
    <div>
      {/* <div className="flex flex-col md:gap-1 mb-2">
        <Text fz={25} fw={600}>
          Handheld Cameras & Microphones
        </Text>
        <Text fz={18} fw={500} c={"#64748b"}>
          Professional handheld recording techniques and audio setup
        </Text>
      </div> */}
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Data?.map((item, index) => {
            return (
              <Card
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`${pathname}/dronefolder/${item.id}`)}
                key={index}
                shadow="sm"
                radius="md"
                withBorder
                pb={60}
              >
                <Group gap={6}>
                  <IconFolder stroke={1.5} size={60} />
                  <Text fz="20" fw={700}>
                    {item.name}
                  </Text>
                </Group>

                <div>
                  <Progress mt={"md"} value={0} h={15} radius={10} />
                </div>

                <Text mt={"md"} fz="20" fw={500} c="#64748B">
                  {item.video_count} video available
                </Text>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
