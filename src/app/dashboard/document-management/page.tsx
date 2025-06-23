"use client";
import {
  Card,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Divider,
  Button,
  Center,
  Select,
} from "@mantine/core";
import {
  IconClock,
  IconFolder,
  IconMenuDeep,
  IconRosetteDiscountCheck,
  IconXboxX,
  IconEye,
  IconShield,
  IconFileText,
  IconSchool,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense, useState } from "react";
import PolicyTable from "./_components/PolicyTable";
import { useEmployeeDocuments } from "@/Hooks/useEmployeeDocuments";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";

type SegmentValues = "overview" | "policies" | "procedures" | "training";

export default function Page() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [value, setValue] = useState<SegmentValues>("overview");

  // API DATA
  const { data } = useEmployeeDocuments({
    employeeId: session?.user?.id,
  });

  const CardsData: {
    title: string;
    subtitle: string;
    count?: string;
    color: string;
    Icon: React.ReactNode;
  }[] = [
    {
      title: "Total Documents",
      subtitle: `${data.totalDocuments || 0} uploaded documents`,
      color: "#054EFA",
      Icon: <IconFolder size={70} color="white" />,
    },
    {
      title: "Pending Documents",
      subtitle: `You have ${data.pendingDocuments || 0} pending`,
      color: "#228039",
      Icon: <IconClock size={70} color="white" />,
    },
    {
      title: "Verified Documents",
      subtitle: `${data.verifiedDocuments || 0} Verified Documents`,
      color: "#FA9005",
      Icon: <IconRosetteDiscountCheck size={70} color="white" />,
    },
    {
      title: "Rejected Documents",
      subtitle: `${data.rejectedDocuments || 0} Rejected Documents`,
      color: "#FA9005",
      Icon: <IconXboxX size={70} color="white" />,
    },
  ];

  // Enhanced data with icons and responsive labels
  const segmentData = [
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconEye size={16} />
          <span className="hidden sm:inline">Overview</span>
          <span className="sm:hidden text-xs">Overview</span>
        </Center>
      ),
      value: "overview",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconShield size={16} />
          <span className="hidden sm:inline">Policies</span>
          <span className="sm:hidden text-xs">Policy</span>
        </Center>
      ),
      value: "policies",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconFileText size={16} />
          <span className="hidden sm:inline">Procedures</span>
          <span className="sm:hidden text-xs">Proc</span>
        </Center>
      ),
      value: "procedures",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconSchool size={16} />
          <span className="hidden sm:inline">Training Materials</span>
          <span className="sm:hidden text-xs">Training</span>
        </Center>
      ),
      value: "training",
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Responsive SegmentedControl - hidden on very small screens */}
            <div className="block sm:hidden mt-6">
              <Select
                value={value}
                onChange={(val) => setValue(val as SegmentValues)}
                data={segmentData.map((item) => ({
                  value: item.value,
                  label: item.value,
                }))}
                size="md"
                placeholder="Select section"
              />
            </div>
            <div className="hidden sm:block">
              <SegmentedControl
                value={value}
                onChange={(val) => setValue(val as SegmentValues)}
                color="#0039C8"
                size="lg" // Smaller size for better mobile fit
                radius="xl"
                withItemsBorders={false}
                fullWidth
                data={segmentData}
                styles={{
                  root: {
                    overflow: "auto",
                  },
                }}
              />
            </div>

            {/* My Documents Button */}
            {value === "overview" && (
              <Link href={`${pathname}/my_docs`}>
                <Button
                  variant="filled"
                  radius="xl"
                  color="#054EFA"
                  leftSection={<IconMenuDeep />}
                >
                  <span>My Documents</span>
                </Button>
              </Link>
            )}
          </div>

          {value === "overview" && (
            <div className="mt-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {CardsData?.map((card, index) => (
                  <Card
                    key={index}
                    shadow="sm"
                    padding="xl"
                    radius="40"
                    bg={"#0039C8"}

                    // className="text-white"
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
                ))}
              </div>
            </div>
          )}

          {value === "policies" && (
            <div className="mt-16 w-full lg:w-[70%]">
              <PolicyTable />
            </div>
          )}
        </div>
      </div>{" "}
    </Suspense>
  );
}
