/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Group, Text, Title } from "@mantine/core";
import { IconCheck, IconPointFilled, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { NextSegementValue } from "./types";
import { showNotification } from "@mantine/notifications";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { useSession } from "next-auth/react";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { isDocumentAccepted } from "@/Hooks/Helper";

const InfoSession = ({
  // title,
  description,
}: {
  title?: string;
  description: string;
}) => {
  return (
    <div>
      <Title order={4} mb={"md"}>
        {/* {title} */}
      </Title>
      <Text mt={"sm"} size="md">
        {description}
      </Text>
    </div>
  );
};

const DATA = [
  {
    description: "Drones become guardians, soaring over our local homes & remote areas, ensuring your safety.",
  },
  {
    description: "Fields bloom with precision agriculture, banishing hunger with data-driven harvests.",
  },
  // {
  //   description: "Industry-leading customer satisfaction ratings",
  // },
  // {
  //   description: "Multiple awards for product innovation",
  // },
  // {
  //   description: "Consistent annual growth since founding",
  // },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AchieveSession = ({ title }: { title?: string }) => {
  return (
    <div>
      <Title order={4} mb={"md"}>
        {title}
      </Title>
      <div className="flex flex-col gap-y-2">
        {DATA?.map((item, index) => {
          return (
            <div className="flex items-center" key={index}>
              <IconPointFilled size={"15"} />
              <Text ml={"xs"} fw={"bold"}>
                {item.description}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ListItems = ({ title }: { title?: string }) => {
  return (
    <div>
      <Title order={6} mb={"md"}>
        {title}
      </Title>
      <div className="flex flex-col gap-y-2">
        {DATA?.map((item, index) => {
          return (
            <div className="flex items-center" key={index}>
              <IconPointFilled size={"15"} />
              <Text ml={"xs"} fw={"normal"}>
                {item.description}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function CompanyProfile({
  NextSegement,
}: {
  NextSegement: (value: NextSegementValue) => void;
}) {
  const VisionMissions: {
    title: string;
    description: string;
    type: "para" | "list";
  }[] = [
    {
      title: "",
      description: "Africa Drone Kings: Bridging the Gap, One Sky at a Time",
      type: "para",
    },
    {
      title: "",
      description:
        "2018: We looked across the chasm, a vast divide separating Africa from the cutting-edge solutions of the 5th Industrial Revolution. Drones whizzed through first-world skies, while here, access, infrastructure, and even perspectives on technology held us back. Hunger gnawed at fields, public safety hung in the balance, and surveying remained an antiquated dance with theodolites.",
      type: "para",
    },
    {
      title: "",
      description:
        "That's where we stepped in, not as tech vendors, but as problem-solvers. Africa Drone Kings wasn't born from a love of gadgets only, but a burning desire to bridge that gap. We didn't just offer drones; we built a bridge, brick by brick, from consultancy to procurement, training to after-sales support.",
      type: "para",
    },
    {
      title: "",
      description:
        "Our Founding CEO, a visionary leader - Vice Phiri saw the sky not as a limit, but a launchpad. Under his guidance, we've carved breakthroughs in drone technology that could revolutionize African landscapes.",
      type: "para",
    },
    {
      title: "Imagine a world where:",
      description: "",
      type: "list",
    },
    {
      title: "",
      description:
        "Ancient landmarks whisper their secrets, revealed by the keen eyes of aerial surveys.",
      type: "para",
    },
    {
      title: "",
      description:
        "We don't just fall in love with solutions; we fall head over heels for the problems themselves. We tinker, we adapt, we push boundaries until our drones become not just machines, but tools for transformation.",
      type: "para",
    },

    {
      title: "",
      description:
        "This isn't just about drones; it's about Africa's future taking flight. We're Africa Drone Kings, and we're here to paint the sky with possibilities, one drone, one breakthrough at a time",
      type: "para",
    },

    // {
    //   title: "Global Presence",
    //   description:
    //     "With headquarters in San Francisco, we maintain offices in New York, London, Singapore, and Sydney, allowing us to serve clients around the globe.",
    // },
  ];

  // HOOKS
  const { data } = useSession();

  // API
  const { data: onboarding } = useCustomGet<any>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/accepted-documents`,
  });

  const acceptedDocs = onboarding?.accepted_documents || [];

  const isDocAccepted: boolean = isDocumentAccepted(
    "company_profile",
    acceptedDocs
  );

  // STATES
  const [isloading, setisloading] = useState<boolean>(false);

  // API
  const POST_ACTION = useCustomPost<any>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/accept/company_profile`,
    onSuccess: (data: any) => {
      NextSegement(null);
      showNotification({
        title: "Success",
        message: data?.message || "Changes saved successfully!",
        color: "green",
        icon: <IconCheck />,
        position: "bottom-right",
      });
    },
    onError: (error: any) => {
      if (error?.data?.message === "Already accepted.") {
        NextSegement(null);
        return;
      }
      showNotification({
        title: "Error",
        message: error?.data?.message || "Something went wrong!",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
    },
  });

  const handleSubmit = async () => {
    try {
      setisloading(true);
      POST_ACTION.mutate(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      // showNotification({
      //   title: "Error",
      //   message: error?.response?.data?.message || "Something went wrong!",
      //   color: "red",
      //   icon: <IconX />,
      //   position: "top-right",
      // });
    } finally {
      setisloading(false);
    }
  };

  return (
    <div>
      <div>
        <Title order={3}>Company Profile</Title>
        <Text size="sm" c="#64748b" mb={"lg"}>
          Learn about our company history and achievements
        </Text>
      </div>
      <div className="flex flex-col gap-y-3.5">
        {VisionMissions?.map((item, index) => (
          <div key={index}>
            {item.type == "list" ? (
              <ListItems title={item.title} />
            ) : (
              <InfoSession description={item.description} title={item.title} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-8">
        {!isDocAccepted && (
          <Group justify="space-between">
            <Button component={Link} href={"/dashboard"} variant="default">
              Back to Dashboard
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isloading}
              variant="filled"
              color={"dark"}
            >
              Mark as Complete
            </Button>
          </Group>
        )}
      </div>
    </div>
  );
}
