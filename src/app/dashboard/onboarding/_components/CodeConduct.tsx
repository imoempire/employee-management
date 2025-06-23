/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Group, Text, Title } from "@mantine/core";
import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { NextSegementValue } from "./types";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { isDocumentAccepted } from "@/Hooks/Helper";

const ConductSession = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div>
      <Title order={4}>{title}</Title>
      <Text mt={"sm"} size="md">
        {description}
      </Text>
    </div>
  );
};

export default function CodeConduct({
  NextSegement,
}: {
  NextSegement: (value: NextSegementValue) => void;
}) {
  const Conducts: { title: string; description: string }[] = [
    {
      title: "Professional Conduct",
      description:
        "We expect all employees to conduct themselves professionally and ethically. This means treating others with respect, honesty, and fairness at all times.",
    },
    {
      title: "Respect in the Workplace",
      description:
        "We're committed to maintaining a respectful workplace free from harassment, discrimination, and bullying. We value diversity and inclusion, and expect all team members to contribute to a positive work environment.",
    },
    {
      title: "Conflicts of Interest",
      description:
        "Avoid situations where personal interests could interfere with your ability to make objective decisions in the best interest of the company. Disclose any potential conflicts to management.",
    },
    {
      title: "Confidentiality",
      description:
        "Protect confidential information about our company, our customers, and your colleagues. Do not disclose sensitive information to unauthorized individuals.",
    },
  ];

  // HOOKS
  const { data } = useSession();

  // API
  const { data: onboarding } = useCustomGet<any>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/accepted-documents`,
  });

  const acceptedDocs = onboarding?.accepted_documents || [];

  const isDocAccepted: boolean = isDocumentAccepted("coc", acceptedDocs);

  // STATES
  const [isloading, setisloading] = useState<boolean>(false);

  // API
  const POST_ACTION = useCustomPost<any>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/accept/coc`,
    onSuccess: (data: any) => {
      NextSegement("Organizational Structure");
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
        NextSegement("Organizational Structure");
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
        <Title order={3} c={"#1e2939"}>Code of Conduct</Title>
        <Text size="sm" c="#64748b" mb={"lg"}>
          Our company values and behavior guidelines
        </Text>
      </div>
      <div className="flex flex-col gap-y-3.5">
        {Conducts?.map((item, index) => (
          <ConductSession
            key={index}
            description={item.description}
            title={item.title}
          />
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
