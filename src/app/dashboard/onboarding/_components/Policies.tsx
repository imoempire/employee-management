/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  IconCheck,
  IconPointFilled,
  IconX,
  IconFileText,
  IconShield,
  IconShirt,
  IconGavel,
} from "@tabler/icons-react";
import { Modal, Paper, Text, Title, Button, Group } from "@mantine/core";
import { NextSegementValue, PolicesResponse, PolicyDocument } from "./types";
import { showNotification } from "@mantine/notifications";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { useSession } from "next-auth/react";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { isDocumentAccepted } from "@/Hooks/Helper";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

// const InfoSession = ({
//   // title,
//   description,
// }: {
//   title?: string;
//   description: string;
// }) => {
//   return (
//     <div>
//       <Title order={4} mb={"md"}>
//         {/* {title} */}
//       </Title>
//       <Text mt={"sm"} size="md">
//         {description}
//       </Text>
//     </div>
//   );
// };

const DATA = [
  {
    description:
      "Drones become guardians, soaring over our local homes & remote areas, ensuring your safety.",
  },
  {
    description:
      "Fields bloom with precision agriculture, banishing hunger with data-driven harvests.",
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const PolicyCard = ({
  item,
  onViewPdf,
}: {
  item: PolicyDocument;
  onViewPdf: () => void;
}) => {
  const PoliciesIcons: Record<string, any> = {
    "policy management framework": <IconFileText />,
    "policy register": <IconFileText />,
    "code of conduct": <IconShield />,
    "disciplinary policy": <IconGavel />,
    "dress code policy": <IconShirt />,
  };

  return (
    <Paper
      shadow="0"
      py="xl"
      px="md"
      style={{ cursor: "pointer", width: "100%" }}
      withBorder
      radius="sm"
      onClick={onViewPdf}
    >
      <div className="flex gap-x-2.5 items-center">
        {PoliciesIcons[item?.title?.toLowerCase()]}
        <Text>{item?.title}</Text>
      </div>
    </Paper>
  );
};

export default function CompanyPolicies({
  NextSegement,
}: {
  NextSegement: (value: NextSegementValue) => void;
}) {
  // HOOKS
  const { data } = useSession();

  // API
  const { data: CompanyPolicies } = useCustomGet<PolicesResponse>({
    url: `${API_ENDPOINT.ADMIN}/policy-document/list`,
  });

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
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedPolicy, setSelectedPolicy] = useState<{
    title: string;
    pdfUrl: string;
  } | null>(null);

  const handleViewPdf = (title: string, file_url: string) => {
    setSelectedPolicy({ title, pdfUrl: file_url });
    open();
  };

  // API
  const POST_ACTION = useCustomPost<any>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/accept/company_profile`,
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
        <Title order={3}>Company Policies</Title>
        <Text size="sm" c="#64748b" mb="lg">
          Important policies and procedures you need to know
        </Text>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        {CompanyPolicies?.documents?.map((item, index) => (
          <div
            key={item.id}
            className={`${
              CompanyPolicies?.documents.length % 2 === 1 &&
              index === CompanyPolicies?.documents?.length - 1
                ? "col-span-2"
                : "col-span-1"
            }`}
          >
            <PolicyCard
              item={item}
              onViewPdf={() => handleViewPdf(item.title, item?.file_url)}
            />
          </div>
        ))}
      </div>
      <div className="mt-8">
        {!isDocAccepted && (
          <Group justify="space-between">
            <Button component={Link} href="/dashboard" variant="default">
              Back to Dashboard
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isloading}
              variant="filled"
              color="dark"
            >
              Mark as Complete
            </Button>
          </Group>
        )}
      </div>
      <Modal
        opened={opened}
        onClose={() => close()}
        title={
          <Text fz={"h2"} fw={"bolder"}>
            {selectedPolicy?.title || "Policy Document"}
          </Text>
        }
        size="xl"
        centered
      >
        {selectedPolicy && (
          <iframe
            src={selectedPolicy.pdfUrl}
            title="PDF Viewer"
            style={{ width: "100%", height: "70vh", border: "none" }}
          />
        )}
        <div className="flex py-2.5 justify-end">
          <Button onClick={close} variant="filled" color="dark">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
