import { Flex, Paper } from "@mantine/core";
import React from "react";

interface CardProps {
  title: string;
  subtitle: string;
  OptionsComponent: React.ReactNode;
}

export default function SettingCard({
  title,
  subtitle,
  OptionsComponent,
}: CardProps) {
  return (
    <Paper radius={'md'} shadow="0" withBorder p={"md"}>
      <Flex justify={"space-between"} align={'center'}>
        <div>
          <span className="text-lg font-semibold">{title}</span>
          <p className="text-md font-medium text-[#64748B]">{subtitle}</p>
        </div>
        {OptionsComponent}
      </Flex>
    </Paper>
  );
}
