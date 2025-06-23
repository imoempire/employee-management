"use client";
import Loading from "@/components/loading";
import { Center, SegmentedControl, Select, Text, Title } from "@mantine/core";
import React, { JSX, Suspense, useState } from "react";
import { consumerSegmentValues } from "../_components/types";
import Drones from "./_components/Drones";
import Handheld from "./_components/Handheld";
import Gimbal from "./_components/Gimbal";

export default function Page() {
  const [value, setValue] = useState<consumerSegmentValues>("Drones");

  const Tabs: Record<consumerSegmentValues, JSX.Element> = {
    Drones: <Drones />,
    Gimbal: <Gimbal />,
    "Handheld Cams & Mic": <Handheld />,
  };

  const segmentData: {
    label: JSX.Element;
    value: consumerSegmentValues;
  }[] = [
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Drones</span>
          <span className="sm:hidden text-xs">Drones</span>
        </Center>
      ),
      value: "Drones",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Gimbal</span>
          <span className="sm:hidden text-xs">Gimbal</span>
        </Center>
      ),
      value: "Gimbal",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Handheld Cams & Mic</span>
          <span className="sm:hidden text-xs">Handheld Cams & Mic</span>
        </Center>
      ),
      value: "Handheld Cams & Mic",
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          <div className="flex flex-col justify-center items-start sm:flex-row sm:justify-between sm:items-center">
            <div className="order-last sm:order-first">
              <Title order={1} c={"#1e2939"}>
                Consumer Drones Onboarding
              </Title>
              <Text size="lg" c="#64748b" mb={"md"}>
                Master consumer drones, gimbals, and handheld cameras through
                comprehensive video tutorials
              </Text>
            </div>
          </div>

          <div className="block sm:hidden mt-6">
            <Select
              value={value}
              onChange={(val) => setValue(val as consumerSegmentValues)}
              data={segmentData.map((item) => ({
                value: item.value,
                label: item.value,
              }))}
              size="md"
              placeholder="Select section"
            />
          </div>

          <div className="hidden sm:block mt-10">
            <SegmentedControl
              value={value}
              onChange={(val) => setValue(val as consumerSegmentValues)}
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
            {value && Tabs[value]}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
