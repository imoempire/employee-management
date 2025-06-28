/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Center,
  Paper,
  Progress,
  SegmentedControl,
  Select,
  Text,
  Title,
} from "@mantine/core";
import React, { JSX, Suspense, useState } from "react";
import {
  IconBook,
  IconBuilding,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";
import { NextSegementValue, SegmentValues } from "./_components/types";
import { useRouter } from "next/navigation";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { useSession } from "next-auth/react";
import { calculateCompletionPercentage } from "@/Hooks/Helper";
// import CodeConduct from "./_components/CodeConduct";
import VisionMission from "./_components/VisionMission";
import CompanyPolicies from "./_components/Policies";
import Welcome from "./_components/Welcome";
import OrgStructure from "./_components/OrgStructure";
import Loading from "@/components/loading";

export default function Page() {
  const router = useRouter();
  const { data } = useSession();
  const [value, setValue] = useState<SegmentValues>("Welcome Message");

  const NextSegement = (value: NextSegementValue) => {
    if (!value) {
      router.replace("/dashboard");
      return;
    }
    if (value !== null) setValue(value);
  };

  const Tabs: Record<SegmentValues, JSX.Element> = {
    "Welcome Message": <Welcome NextSegement={NextSegement} />,
    "Vision, Mission & Values": <VisionMission NextSegement={NextSegement} />,
    Policies: <CompanyPolicies NextSegement={NextSegement} />,
    // "Code of Conduct": <CodeConduct NextSegement={NextSegement} />,
    "Organizational Structure": <OrgStructure NextSegement={NextSegement} />,
  };

  const segmentData: {
    label: JSX.Element;
    value: SegmentValues;
  }[] = [
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconShield size={16} />
          <span className="hidden sm:inline">Welcome Message</span>
          <span className="sm:hidden text-xs">Welcome Message</span>
        </Center>
      ),
      value: "Welcome Message",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconBook size={16} />
          <span className="hidden sm:inline">Vision, Mission & Values</span>
          <span className="sm:hidden text-xs">Vision, Mission & Values</span>
        </Center>
      ),
      value: "Vision, Mission & Values",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconUsers size={16} />
          <span className="hidden sm:inline">Policies</span>
          <span className="sm:hidden text-xs">Policies</span>
        </Center>
      ),
      value: "Policies",
    },
    // {
    //   label: (
    //     <Center style={{ gap: 6 }}>
    //       <IconShield size={16} />
    //       <span className="hidden sm:inline">Code of Conduct</span>
    //       <span className="sm:hidden text-xs">Code</span>
    //     </Center>
    //   ),
    //   value: "Code of Conduct",
    // },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <IconBuilding size={16} />
          <span className="hidden sm:inline">Organizational Structure</span>
          <span className="sm:hidden text-xs">Organizational Structure</span>
        </Center>
      ),
      value: "Organizational Structure",
    },
  ];

  // API
  const { data: onboarding } = useCustomGet<{ accepted_documents: string[] }>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/accepted-documents`,
  });
  const acceptedDocs = onboarding?.accepted_documents || [];
  const requiredDocs = ["coc", "company_profile", "vision_mission"];

  const onBoardingPercentage: number = calculateCompletionPercentage(
    requiredDocs,
    acceptedDocs
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div>
            <Title order={1} c={"#1e2939"}>
              General Onboarding
            </Title>
            <Text size="lg" c="#64748b" mb={"lg"}>
              Learn about our company values, policies, and structure to help
              you get started.
            </Text>
          </div>

          <Paper withBorder p={"md"} mb={"xl"} shadow="xs">
            <div className="flex flex-col gap-y-1.5">
              <div className="flex justify-between items-center">
                <Text size="xl" fw={"500"}>
                  Onboarding
                </Text>
                <Text size="sm" fw={"500"} c={"#64748B"}>
                  {acceptedDocs?.length}/{segmentData.length} sections completed
                </Text>
              </div>
              <Progress value={onBoardingPercentage || 0} />
            </div>
          </Paper>

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

          {/* Desktop: SegmentedControl */}
          <div className="hidden sm:block">
            <SegmentedControl
              value={value}
              onChange={(val) => setValue(val as SegmentValues)}
              size="md"
              radius={"sm"}
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

          <div className="mt-5">
            <Paper shadow="xs" p={"md"} withBorder>
              {value && Tabs[value]}
            </Paper>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
