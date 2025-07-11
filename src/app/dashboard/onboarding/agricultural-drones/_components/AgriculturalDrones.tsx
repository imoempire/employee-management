import { useCustomGet } from "@/Hooks/useCustomGet";
import { Card, Group, Progress, Skeleton, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export type Folder = {
  id: number;
  name: string;
  description: string;
  video_count: number;
  created_at: string;
};

export type FolderResponse = {
  message: string;
  folders: Folder[];
};

export default function AgriculturalDrones() {
  const router = useRouter();
  const pathname = usePathname();

  // DATA API
  const { data: dronesFolder, isLoading } = useCustomGet<FolderResponse>({
    url: `https://erp.mawuena.com/api/admin/agric-folder/list`,
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
        {isLoading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(4)
              .fill(null)
              .map((_, i) => {
                return <Skeleton height={200} key={i} />;
              })}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Data?.map((item, index) => {
            return (
              <Card
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push(`${pathname}/dronefolder/${item.id}`)
                }
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
