"use client";
import {
  Center,
  Progress,
  SegmentedControl,
  Select,
  Text,
  Title,
} from "@mantine/core";
import React, { JSX, Suspense, useState } from "react";
import { droneSegmentValues } from "../_components/types";
import { IconExternalLink, IconFileText, IconVideo } from "@tabler/icons-react";
import OnboardingVideos from "./_components/OnboardingVideos";
import OnboardingMaterials from "./_components/OnboardingMaterials";
import OnboardingQuicklinks from "./_components/OnboardingQuicklinks";
import Loading from "@/components/loading";

export default function Page() {
  const [value, setValue] = useState<droneSegmentValues>("Onboarding Videos");
  const [completed, setCompleted] = useState<number>(0);
  const [NumberVideos, setNumberVideos] = useState<number>(0);
  // console.log(NumberVideos, "NumberVideos");

  // const NextSegement = (value: dronNextSegementValue) => {
  //   // if (!value) {
  //   //   router.replace("/dashboard");
  //   //   return;
  //   // }
  //   if (value !== null) setValue(value);
  // };

  const Tabs: Record<droneSegmentValues, JSX.Element> = {
    "Onboarding Videos": (
      <OnboardingVideos
        setCompleted={setCompleted}
        setNumberVideos={setNumberVideos}
      />
    ),
    "Onboarding Materials": <OnboardingMaterials />,
    "Onboarding Quicklinks": <OnboardingQuicklinks />,
  };

  const TabsIcons: Record<droneSegmentValues, JSX.Element> = {
    "Onboarding Videos": <IconVideo size={30} />,
    "Onboarding Materials": <IconFileText />,
    "Onboarding Quicklinks": <IconExternalLink />,
  };

  const segmentData: {
    label: JSX.Element;
    value: droneSegmentValues;
  }[] = [
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Onboarding Videos</span>
          <span className="sm:hidden text-xs">Onboarding Videos</span>
        </Center>
      ),
      value: "Onboarding Videos",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Onboarding Materials</span>
          <span className="sm:hidden text-xs">Onboarding Materials</span>
        </Center>
      ),
      value: "Onboarding Materials",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Onboarding Quicklinks</span>
          <span className="sm:hidden text-xs">Onboarding Quicklinks</span>
        </Center>
      ),
      value: "Onboarding Quicklinks",
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div className="flex flex-col justify-center items-start sm:flex-row sm:justify-between sm:items-center">
            <div className="order-last sm:order-first">
              <Title order={1} c={"#1e2939"}>
                Enterprise Drone Onboarding
              </Title>
              <Text size="lg" c="#64748b" mb={"md"}>
                Complete your enterprise drone onboarding by watching videos and
                reviewing materials
              </Text>

              <div className="flex flex-col gap-y-1.5 w-full sm:w-1/2">
                <div className="flex justify-between items-center">
                  <Text size="sm" fw={"500"}>
                    Progress: 0% complete
                  </Text>
                </div>
                <Progress value={0} />
              </div>
            </div>

            <div className="order-first sm:order-last mb-6 sm:mb-0 sm:ml-20">
              {/* <Button
              variant="default"
              py={"sm"}
              leftSection={<IconArrowNarrowLeft />}
            >
              Back to Dashboard
            </Button> */}
            </div>
          </div>

          <div className="block sm:hidden mt-6">
            <Select
              value={value}
              onChange={(val) => setValue(val as droneSegmentValues)}
              data={segmentData.map((item) => ({
                value: item.value,
                label: item.value,
              }))}
              size="md"
              placeholder="Select section"
            />
          </div>

          {/* Desktop: SegmentedControl */}
          <div className="hidden sm:block mt-10">
            <SegmentedControl
              value={value}
              onChange={(val) => setValue(val as droneSegmentValues)}
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

          <div className="flex flex-col gap-y-1 mt-5">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div>{value && TabsIcons[value]}</div>
                <Text fz={25} fw={600}>
                  {value}
                </Text>
              </div>
              <Text fz={15} fw={400} c={"#64748b"}>
                {value == "Onboarding Materials"
                  ? `(${0}/${0} downloaded)`
                  : value == "Onboarding Quicklinks"
                  ? "Quick access to important resources"
                  : `(${completed}/${NumberVideos} completed)`}
              </Text>
            </div>
            {value && Tabs[value]}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
