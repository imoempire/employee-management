"use client";
import Loading from "@/components/loading";
import { Center, SegmentedControl, Select, Title } from "@mantine/core";
import React, { JSX, Suspense, useEffect, useState } from "react";
import { agricSegmentValues } from "../_components/types";
import { useRouter, useSearchParams } from "next/navigation";
import AgriculturalDrones from "./_components/AgriculturalDrones";
import Other from "./_components/Other";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  //   STATES
  const [value, setValue] = useState<agricSegmentValues>(() => {
    const tabFromUrl = searchParams.get("tab") as agricSegmentValues;
    return tabFromUrl &&
      ["Agricultural Drones", "Other Onboarding Materials"].includes(tabFromUrl)
      ? tabFromUrl
      : "Agricultural Drones";
  });

  // Update URL when tab changes
  const handleTabChange = (newValue: agricSegmentValues) => {
    setValue(newValue);

    // Update URL without page reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", newValue);
    router.replace(newUrl.toString());
  };

  // Sync with URL changes (browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as agricSegmentValues;
    if (
      tabFromUrl &&
      ["Agricultural Drones", "Other Onboarding Materials"].includes(tabFromUrl)
    ) {
      setValue(tabFromUrl);
    }
  }, [searchParams]);

  const Tabs: Record<agricSegmentValues, JSX.Element> = {
    "Agricultural Drones": <AgriculturalDrones />,
    "Other Onboarding Materials": <Other />,
  };

  const segmentData: {
    label: JSX.Element;
    value: agricSegmentValues;
  }[] = [
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Agricultural Drones</span>
          <span className="sm:hidden text-xs">Agricultural Drones</span>
        </Center>
      ),
      value: "Agricultural Drones",
    },
    {
      label: (
        <Center style={{ gap: 6 }}>
          <span className="hidden sm:inline">Other Onboarding Materials</span>
          <span className="sm:hidden text-xs">Other Onboarding Materials</span>
        </Center>
      ),
      value: "Other Onboarding Materials",
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          {/* TITLE */}
          <div className="flex flex-col justify-center items-start sm:flex-row sm:justify-between sm:items-center">
            <div className="order-last sm:order-first">
              <Title order={1} c={"#1e2939"}>
                Agricultural Drones Onboarding
              </Title>
            </div>
          </div>
          {/* TABS */}
          <div className="block sm:hidden mt-6">
            <Select
              value={value}
              onChange={(val) => handleTabChange(val as agricSegmentValues)}
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
              onChange={(val) => handleTabChange(val as agricSegmentValues)}
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
