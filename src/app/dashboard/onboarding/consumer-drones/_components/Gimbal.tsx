import React from "react";
import { Card, Group, Progress, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { GimbalFolderListResponse } from "./types";

export default function Gimbal() {
  const router = useRouter();
  const pathname = usePathname();

  // DATA API
  const { data: gimbalfolders } = useCustomGet<GimbalFolderListResponse>({
    url: `https://erp.mawuena.com/api/admin/gimbal-folder/list`,
  });

  const Data = gimbalfolders?.folders || [];

  return (
    <div>
      {/* <div className="flex flex-col md:gap-1 mb-2">
        <Text fz={25} fw={600}>
          Gimbal Training
        </Text>
        <Text fz={15} fw={400} c={"#64748b"}>
          Master gimbal operation for smooth and professional footage
        </Text>
      </div> */}
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Data.map((item, index) => {
            return (
              <Card
                onClick={() =>
                  router.push(`${pathname}/gimbalfolder/${item.id}`)
                }
                style={{ cursor: "pointer" }}
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
