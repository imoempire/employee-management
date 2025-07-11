import { Center, Text } from "@mantine/core";
import React from "react";

export default function Other() {
  return (
    <Center>
      <div className="flex flex-col md:gap-1 mb-2 items-center mt-[5%]">
        <Text fz={25} fw={600}>
          Other Onboarding Materials
        </Text>
        <Text fz={18} fw={500} c={"#64748b"}>
          Additional onboarding materials will be available here soon.
        </Text>
      </div>
    </Center>
  );
}
