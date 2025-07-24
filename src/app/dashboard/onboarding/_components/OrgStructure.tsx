import React from "react";
import {
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { NextSegementValue } from "./types";
import Link from "next/link";
import { IconMoodEmpty } from "@tabler/icons-react";
// import OrgChart from "@/components/OrgChart";

// const InfoSession = ({
//   title,
//   description,
// }: {
//   title: string;
//   description: string;
// }) => {
//   return (
//     <div>
//       <Title order={4} mb={"md"}>
//         {title}
//       </Title>
//       <Text mt={"sm"} size="md">
//         {description}
//       </Text>
//     </div>
//   );
// };

// const DATA = [
//   {
//     title: "Product Development",
//     description:
//       "Responsible for designing, building, and maintaining our software products.",
//   },
//   {
//     title: "Customer Success",
//     description:
//       "Ensures clients achieve their desired outcomes through our solutions.",
//   },
//   {
//     title: "Sales & Marketing",
//     description:
//       "Drives growth through market expansion and building client relationships.",
//   },
//   {
//     title: "Human Resources",
//     description:
//       "Manages talent acquisition, employee development, and company culture.",
//   },
// ];

// const DepartmentsCard = ({ title }: { title: string }) => {
//   return (
//     <div>
//       <Title order={4} mb={"md"}>
//         {title}
//       </Title>
//       <div className="grid grid-cols-2 gap-4">
//         {DATA?.map((item, index) => {
//           return (
//             <Paper shadow="0" withBorder p={"md"} key={index}>
//               <Title order={4} mb={"sm"}>
//                 {item?.title}
//               </Title>
//               <Text fw={"normal"}>{item.description}</Text>
//             </Paper>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

export default function OrgStructure({
  NextSegement,
}: {
  NextSegement: (value: NextSegementValue) => void;
}) {
  // const VisionMissions: { title: string; description: string }[] = [
  //   {
  //     title: "Executive Leadership",
  //     description:
  //       "Our company is led by an executive team with decades of combined experience in the industry. The leadership team includes the CEO, CTO, CFO, and department heads who collaborate to guide our strategic direction.",
  //   },
  //   {
  //     title: "Key Departments",
  //     description: "",
  //   },
  //   {
  //     title: "Team Structure",
  //     description:
  //       "We operate in a relatively flat organization with cross-functional teams. This approach encourages collaboration, innovation, and quick decision-making. Most teams include members from various disciplines to ensure diverse perspectives.",
  //   },
  // ];

  const handleSubmit = async () => {
    try {
      //   setisloading(true);
      //   POST_ACTION.mutate(null);
      NextSegement(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // showNotification({
      //   title: "Error",
      //   message: error?.response?.data?.message || "Something went wrong!",
      //   color: "red",
      //   icon: <IconX />,
      //   position: "top-right",
      // });
    }
  };

  return (
    <div>
      <Center display={'none'}>
        <Stack gap={2} align="center" justify="center">
          <IconMoodEmpty color="gray" />
          <Text c="dimmed">No data available</Text>
        </Stack>
      </Center>
      <div className="hidden">
        <Title order={3}>Company Profile</Title>
        <Text size="sm" c="#64748b" mb={"lg"}>
          Learn about our company history and achievements
        </Text>
      </div>
      <div>
        <Image src={"/orgchart.jpeg"} w={'100%'} height={"100%"} alt="orgchart" />
      </div>
      <div className="mt-8 hidden">
        <Group justify="space-between">
          <Button component={Link} href={"/dashboard"} variant="default">
            Back to Dashboard
          </Button>{" "}
          <Button onClick={handleSubmit} variant="filled" color={"dark"}>
            Mark as Complete
          </Button>
        </Group>
      </div>
    </div>
  );
}
