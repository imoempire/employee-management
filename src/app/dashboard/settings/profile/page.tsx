/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Textarea,
  TextInput,
} from "@mantine/core";
import React, { Suspense, useEffect, useState } from "react";
import { TextField } from "../_components/TextField";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { ProfileResponse } from "@/Hooks/ApiDataTypes";
import Loading from "@/components/loading";

interface DepartmentResponse {
  message: string;
  departments: {
    id: number;
    department_name: string;
    description: string;
    department_manager: string;
    positions: {
      id: number;
      position_title: string;
      department_id: number;
    }[];
  }[];
}

interface EmployeeFormData {
  full_name: string;
  email: string;
  phone_number: string;
  start_date: string;
  department: string;
  position: string;
  technical_skills: string;
  professional_bio: string;
}

interface PositionsData {
  id: string;
  position_title: string;
  department_id: number;
  required_skills: string;
  department: {
    id: number;
    department_name: string;
  };
}

interface PositionResponse {
  message: string;
  positions: PositionsData[];
}

export default function Page() {
  const { data } = useSession();
  const router = useRouter();

  //API DATA
  const { data: MyProfile } = useCustomGet<ProfileResponse>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/employee-profile`,
  });

  //API DATA
  const { data: DepartmentsData } = useCustomGet<DepartmentResponse>({
    url: `https://erp.mawuena.com/api/department/list`,
  });

  const { data: PositionData } = useCustomGet<PositionResponse>({
    url: `https://erp.mawuena.com/api/position/list`,
  });

  // STATES
  const [Departments, setDepartements] = useState<
    { label: string; value: string }[]
  >([]);
  const [Positions, setPositions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isloading, setisloading] = useState<boolean>(false);

  useEffect(() => {
    if (DepartmentsData?.departments) {
      const departments: { label: string; value: string }[] =
        DepartmentsData?.departments.map((department) => ({
          label: department?.department_name,
          value: department?.id.toString(),
        }));
      setDepartements(departments);
    }
  }, [DepartmentsData]);

  useEffect(() => {
    if (PositionData?.positions) {
      const positions: { label: string; value: string }[] =
        PositionData?.positions.map((position) => ({
          label: position?.position_title,
          value: position?.id.toString(),
        }));
      // Assuming there's a state to set positions, similar to Departments
      setPositions(positions);
    }
  }, [PositionData]);

  // Add
  const form = useForm<EmployeeFormData>({
    initialValues: {
      full_name: "",
      email: "",
      phone_number: "",
      start_date: "",
      department: "",
      position: "",
      technical_skills: "",
      professional_bio: "",
    },
    validate: {
      // full_name: (value) =>
      //   value.trim().length < 2
      //     ? "Full name must be at least 2 characters"
      //     : null,
      // email: (value) =>
      //   !/^\S+@\S+$/.test(value) ? "Invalid email format" : null,
      // phone_number: (value) =>
      //   !/^\d{10,15}$/.test(value.replace(/\D/g, ""))
      //     ? "Phone number must be 10-15 digits"
      //     : null,
      // start_date: (value) => (!value ? "Start date is required" : null),
      // department: (value) => (!value ? "Department is required" : null),
      // position: (value) => (!value ? "Position is required" : null),
      // technical_skills: (value) =>
      //   value.trim().length < 3
      //     ? "Please provide at least 3 characters for technical skills"
      //     : null,
      // professional_bio: (value) =>
      //   value.trim().length < 10
      //     ? "Professional bio should be at least 10 characters"
      //     : null,
    },
  });

  useEffect(() => {
    if (MyProfile?.profile) {
      const profile = MyProfile?.profile;
      form.setFieldValue("email", profile?.email);
      form.setFieldValue("department", profile?.department);
      form.setFieldValue("full_name", profile?.full_name);
      form.setFieldValue("phone_number", profile?.phone_number);
      form.setFieldValue("start_date", profile?.start_date);
      form.setFieldValue("position", profile?.position);
      form.setFieldValue("technical_skills", profile?.technical_skills);
      form.setFieldValue("professional_bio", profile?.professional_bio);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MyProfile?.profile]);

  const profile = MyProfile?.profile;

  const isNewUser = profile
    ? Object.values(profile).some((value) => value !== null && value !== "")
    : false;

  const URL = isNewUser
    ? `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/update-profile`
    : `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/complete-profile`;

  const POST_ACTION = useCustomPost<EmployeeFormData>({
    url: URL,
    onSuccess: (data: any) => {
      router.replace("/dashboard");
      showNotification({
        title: "Success",
        message: data?.message || "Changes saved successfully!",
        color: "green",
        icon: <IconCheck />,
        position: "bottom-right",
      });
    },
    onError: (error: any) => {
      showNotification({
        title: "Error",
        message: error?.data?.errors?.message || "Something went wrong!",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Filter out empty or undefined fields
      const data: Partial<EmployeeFormData> = Object.entries(values).reduce(
        (acc, [key, value]) => {
          if (value !== null && value !== "" && value !== undefined) {
            acc[key as keyof EmployeeFormData] = value;
          }
          return acc;
        },
        {} as Partial<EmployeeFormData>
      );

      // Ensure at least one field is provided
      if (Object.keys(data).length === 0) {
        showNotification({
          title: "Error",
          message: "Please fill in at least one field.",
          color: "red",
          icon: <IconX />,
          position: "bottom-right",
        });
        return;
      }

      await POST_ACTION.mutateAsync(data);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
    } finally {
      setisloading(false);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between mb-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-0.5">Employee Profile</h1>
              <p className="text-xl">
                Complete your employee information to access all portal features
              </p>
            </div>
          </div>
          <Paper shadow="md" withBorder p={"md"} mb={"xl"}>
            <div>
              <h1 className="text-2xl font-bold">
                Personal & Professional Information
              </h1>
              <p className="text-md text-[#64748B]">
                This information will be used for your employee directory
                profile and departmental records.
              </p>
            </div>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <div className="flex flex-col gap-y-6 mt-8">
                <SimpleGrid cols={2} w={"100%"} verticalSpacing="lg">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    {...form.getInputProps("full_name")}
                  />
                  <TextInput
                    label="Work Email"
                    placeholder="Enter your work email address"
                    {...form.getInputProps("email")}
                  />

                  <TextInput
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    {...form.getInputProps("phone_number")}
                  />
                  <DateInput
                    label="Start Date"
                    placeholder="Select start date"
                    valueFormat="YYYY MMM DD"
                    {...form.getInputProps("start_date")}
                  />

                  <Select
                    label="Department"
                    placeholder="Select department"
                    data={Departments}
                    {...form.getInputProps("department")}
                  />
                  <Select
                    label="Position"
                    placeholder="Select position"
                    data={Positions}
                    {...form.getInputProps("position")}
                  />
                </SimpleGrid>
                <TextField
                  mt={"xl"}
                  label="Technical Skills"
                  placeholder="eg: Resources management"
                  caption="Enter your key skills separated by commas"
                  {...form.getInputProps("technical_skills")}
                />
                <Textarea
                  mt={"lg"}
                  styles={{
                    input: {
                      minHeight: 100,
                    },
                  }}
                  label="Professional Bio"
                  placeholder="Brief description of your professional background and experience"
                  {...form.getInputProps("professional_bio")}
                />

                <Group justify="right" mt={"50"}>
                  <Button
                    variant="default"
                    onClick={() => {
                      form.reset();
                      router.back();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="filled"
                    color="dark"
                    type="submit"
                    loading={isloading}
                  >
                    Save Profile
                  </Button>
                </Group>
              </div>
            </form>
          </Paper>
        </div>
      </div>
    </Suspense>
  );
}
