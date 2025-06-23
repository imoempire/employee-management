/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  Text,
  Title,
  Button,
  Group,
  RingProgress,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconDeviceDesktopAnalytics,
  IconFolder,
  IconUserStar,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { API_ENDPOINT } from "@/service/api/endpoints";
import {
  calculateCompletionPercentage,
  calculateDocumentCompletion,
  calculateProfileCompletionPercentage,
} from "@/Hooks/Helper";
import { EmployeeDocData } from "./document-management/_components/Types";
import { Suspense } from "react";
import Loading from "@/components/loading";

export default function DashboardPage() {
  const router = useRouter();
  const { data } = useSession();

  // API
  const { data: onboarding } = useCustomGet<any>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/accepted-documents`,
  });

  const { data: MyProfile } = useCustomGet<any>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/employee-profile`,
  });

  const { data: EmployeeDocs } = useCustomGet<EmployeeDocData>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/document-list`,
  });

  const requiredDocs = ["coc", "company_profile", "vision_mission"];

  const requiredProfile: string[] = [
    "id",
    "employee_id",
    "full_name",
    "email",
    "phone_number",
    "start_date",
    "department",
    "position",
    "technical_skills",
    "professional_bio",
    "created_at",
    "updated_at",
  ];

  const acceptedDocs = onboarding?.accepted_documents || [];

  const acceptedProfile = MyProfile?.profile || [];

  const onBoardingPercentage: number =
    calculateCompletionPercentage(requiredDocs, acceptedDocs) || 0;

  const ProfilePercentage: number =
    calculateProfileCompletionPercentage(acceptedProfile, requiredProfile) || 0;

  const docuPerentage: number =
    calculateDocumentCompletion(EmployeeDocs?.documents || []) || 0;

  const CardsData: {
    title: string;
    subtitle: string;
    barColor?: string;
    color: string;
    Icon: React.ReactNode;
  }[] = [
    {
      title: "Onboarding",
      subtitle: `You have ${onBoardingPercentage}% score`,
      color: "#054EFA",
      Icon: <IconUserStar size={70} color="white" />,
      barColor: "#0438B4",
    },
    {
      title: "Your profile",
      subtitle: `${ProfilePercentage}% profile score`,
      color: "#000000",
      Icon: <IconDeviceDesktopAnalytics size={70} color="white" />,
      barColor: "#696969",
    },
    {
      title: "Your documents",
      subtitle: `${EmployeeDocs?.documents.length || 0} documents uploaded`,
      color: "#228039",
      Icon: <IconFolder size={70} color="white" />,
      barColor: "#11421E",
    },
  ];

  // Data for Progress Circles
  const progressData = [
    {
      title: "Onboarding Score",
      percentage: onBoardingPercentage,
      color: "#054EFA",
      buttonText: "Start Onboarding",
      showButton: onBoardingPercentage < 100 ? true : false,
    },
    {
      title: "Profile Score",
      percentage: ProfilePercentage,
      color: "#000000",
      buttonText: "Complete Profile",
      showButton: ProfilePercentage < 100 && true,
    },
    {
      title: "Document Score",
      percentage: docuPerentage,
      color: "#228039",
      buttonText: "Upload Docs",
      showButton: docuPerentage < 100 && true,
    },
  ];

  const handleprogress = (selected: string) => {
    if (selected === "Start Onboarding") {
      router.push("/dashboard/onboarding");
      return;
    }
    if (selected === "Complete Profile") {
      router.push("/dashboard/settings/profile");
      return;
    }
    if (selected === "Upload Docs") {
      router.push("/dashboard/document-management/my_docs?openModal=true");
      return;
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="container mx-auto p-6">
          {data?.user?.username && (
            <Title mb={"xl"} c={"#1e2939"} order={2} ta="center">
              Hey {data?.user?.username}!
            </Title>
          )}

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {CardsData?.map((card, index) => {
              return (
                <Card
                  key={index}
                  shadow="sm"
                  padding="xl"
                  radius="40"
                  bg={card.color}
                  color="white"
                >
                  <Stack>
                    <Group gap="xs">
                      {card.Icon}
                      <Stack gap={0}>
                        <Text c={"#ffffff"} size="md">
                          {card.title}
                        </Text>
                        <Text c={"#ffffff"} size="sm">
                          {card.subtitle}
                        </Text>
                      </Stack>
                    </Group>
                    <Divider size={6} color={card.barColor || "#00000047"} />
                  </Stack>
                </Card>
              );
            })}
          </div>

          {/* Progress Circles Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressData?.map((item) => (
              <div
                key={item?.title}
                className="flex flex-col items-center border-2 rounded-xl py-4"
              >
                <RingProgress
                  size={250}
                  thickness={24}
                  label={
                    <Text size="xl" ta="center">
                      {item?.percentage}%
                    </Text>
                  }
                  sections={[{ value: item?.percentage, color: item?.color }]}
                />
                <Text size="xl" fw={700} mt="md" c={"#4a5565"}>
                  {item?.percentage}%
                </Text>
                <Text size="sm" c={"#4a5565"}>
                  {item?.title}
                </Text>
                {item?.showButton && (
                  <Button
                    onClick={() => handleprogress(item.buttonText)}
                    miw={"50%"}
                    color="#054EFA"
                    mt="md"
                    radius="lg"
                  >
                    {item.buttonText}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
    </Suspense>
  );
}
