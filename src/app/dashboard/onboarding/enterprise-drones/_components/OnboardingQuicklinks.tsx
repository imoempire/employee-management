import React from "react";
// import { ActionIcon, Button, Card, Group, Stack, Text } from "@mantine/core";
import {
  Icon,
  // IconBook,
  IconExternalLink,
  // IconFileText,
  // IconPhone,
  IconProps,
  // IconUsers,
  // IconVideo,
} from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import EmptyCard from "@/components/EmptyCard";

export default function OnboardingQuicklinks() {
  const onboardingQuicklinks: {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>> ;
  }[] = [
    // {
    //   id: "oq1",
    //   title: "HR Portal",
    //   description: "Access employee resources and submit requests",
    //   url: "#",
    //   icon: IconUsers,
    // },
    // {
    //   id: "oq2",
    //   title: "IT Support",
    //   description: "Get technical support and software access",
    //   url: "#",
    //   icon: IconPhone,
    // },
    // {
    //   id: "oq3",
    //   title: "Company Handbook",
    //   description: "Read policies, procedures, and company information",
    //   url: "#",
    //   icon: IconBook,
    // },
    // {
    //   id: "oq4",
    //   title: "Training Portal",
    //   description: "Access additional training courses and certifications",
    //   url: "#",
    //   icon: IconVideo,
    // },
    // {
    //   id: "oq5",
    //   title: "Equipment Request",
    //   description: "Request drone equipment and accessories",
    //   url: "#",
    //   icon: IconFileText,
    // },
    // {
    //   id: "oq6",
    //   title: "Safety Reporting",
    //   description: "Report safety incidents or near misses",
    //   url: "#",
    //   icon: IconExternalLink,
    // },
  ];

  return (
    <div>
      {onboardingQuicklinks?.length === 0 && <EmptyCard />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {onboardingQuicklinks.map((link) => {
          return (
            <div
              key={link.id}
              className="bg-white border border-gray-200 rounded-lg p-1 shadow-sm"
            >
              <div className="flex justify-between items-center p-4 rounded">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ActionIcon
                    size="xl"
                    disabled
                    aria-label="Disabled and not interactive"
                  >
                    {<link.icon color="black" />}
                  </ActionIcon>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold">{link.title}</h4>
                    <p className="text-sm font-medium opacity-90 break-words w-10/12">
                      {link.description}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <IconExternalLink size={20} stroke={1.5} color="#64748B" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
