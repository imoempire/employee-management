/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Avatar,
  Button,
  Group,
  Indicator,
  Modal,
  Paper,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { TextField } from "./_components/TextField";
import SettingCard from "./_components/Card";
import Loading from "@/components/loading";
import {
  IconAdjustmentsHorizontal,
  IconCamera,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { showNotification } from "@mantine/notifications";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { useSession } from "next-auth/react";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { useForm } from "@mantine/form";
import { SettingProfileResponse } from "./_components/types";
import { Employee } from "@/types/appTypes";

export default function Page() {
  const { data: session, update } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  // console.log(session?.user, 'data');

  const { data: profileDetails, refetch } =
    useCustomGet<SettingProfileResponse>({
      url: `${API_ENDPOINT.EMPLOYEE}/${session?.user?.id}/details`,
      enabled: !!session?.user?.id,
    });

  // Define the mutation for updating the profile picture
  const { mutate, isError, isSuccess, isPending } = useCustomPost<{
    message: string;
    profile_picture_url: string;
  }>({
    url: `https://erp.mawuena.com/api/employee/${session?.user?.id}/update-profile-picture`,
    onSuccess: (data) => {
      showNotification({
        title: "Success",
        message: data.message || "Profile image updated successfully!",
        color: "green",
      });
      if (data?.profile_picture_url) {
        refetch();
      }
    },
    onError: (error: any) => {
      showNotification({
        title: "Error",
        message: error?.message || "Failed to delete profile image",
        color: "red",
      });
    },
  });

  const handleIndicatorClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarImage(imageUrl);

      // Prepare FormData for the mutation
      const formData = new FormData();
      formData.append("profile_picture", file);

      // Trigger the mutation
      mutate(formData);
    }
  };

  const form = useForm({
    initialValues: {
      username: "",
    },
    validate: {
      username: (value) => (value ? null : "User name is required"),
    },
  });

  useEffect(() => {
    if (!profileDetails) return;
    const person = profileDetails.employee;
    setAvatarImage(person.profile_picture);
    form.setValues({
      username: person.username || "",
    });
  }, [profileDetails]);

  const SaveSessonUpdate = async ({
    value,
  }: {
    field?: keyof Employee;
    value: string;
  }) => {
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        username: value,
      },
    };

    console.log(newSession, "New Session");
    

    await update(newSession);
  };

  const { mutate: userMutate, isPending: userPending } = useCustomPost<{
    message: string;
    username: string;
  }>({
    url: `${API_ENDPOINT.EMPLOYEE}/${session?.user?.id}/update-username`,
    onSuccess: (data) => {
      showNotification({
        title: "Success",
        message: data.message || "Profile updated",
        color: "green",
      });
      SaveSessonUpdate({ field: "username", value: data?.username });
      refetch();
    },
    onError: (error: any) => {
      console.log("Error updating profile picture:", error);
      showNotification({
        title: "Error",
        message: error?.message || "Failed to update profile",
        color: "red",
      });
    },
  });

  const handleUserUpdate = (values: { username: string }) => {
    userMutate(values);
  };

  const form2 = useForm({
    initialValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validate: {
      old_password: (value) => (value ? null : "Old password is required"),
      new_password: (value) => (value ? null : "New password is required"),
      new_password_confirmation: (value, values) =>
        value !== values.new_password ? "Passwords do not match" : null,
    },
  });

  const { mutate: passwordMutate, isPending: passwordPending } =
    useCustomPost<any>({
      url: `${API_ENDPOINT.EMPLOYEE}/${session?.user?.id}/change-password`,
      onSuccess: (data) => {
        showNotification({
          title: "Success",
          message: data.message || "Password updated",
          color: "green",
        });
        close();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update password";

        showNotification({
          title: "Error",
          message: errorMessage,
          color: "red",
        });
      },
    });

  const handleChangePassword = (values: {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    passwordMutate(values);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8 items-center">
            <div className="flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5">
                <IconAdjustmentsHorizontal />
                <h1 className="text-3xl font-bold mb-0.5 text-center">
                  Employee Settings
                </h1>
              </div>
              <p className="text-md text-[#64748b] font-medium">
                Manage your account preferences and notification settings
              </p>
            </div>
          </div>
          <Paper shadow="md" withBorder p={"md"} mb={"xl"}>
            <div className="flex flex-col gap-y-3.5">
              <div className="flex justify-center">
                <Indicator
                  size={35}
                  offset={13}
                  position="bottom-end"
                  color="dark"
                  label={<IconCamera size={20} />}
                  onClick={handleIndicatorClick}
                  style={{ cursor: "pointer", zIndex: 1 }}
                >
                  <Avatar
                    size="110"
                    radius="110"
                    name="John Doe"
                    bg="#F1F5F9"
                    src={avatarImage}
                  />
                </Indicator>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-md text-[#64748b] font-medium text-center">
                Click the camera icon to change your profile picture
              </p>
              {isPending && <p>Uploading...</p>}
              {isError && <p>Error uploading profile picture.</p>}
              {isSuccess && <p>Profile picture updated successfully!</p>}
            </div>
            <form onSubmit={form.onSubmit(handleUserUpdate)}>
              <div className="flex flex-col gap-y-6 mt-8">
                <TextField
                  label="Display Name"
                  placeholder="Enter your name"
                  caption="This is how your name will appear in the employee portal"
                  styles={{ label: { fontSize: 16, fontWeight: "600" } }}
                  // required
                  {...form.getInputProps("username")}
                />
                <SettingCard
                  title="Change Password"
                  subtitle="Update your account password"
                  OptionsComponent={
                    <Button onClick={open} variant="default">
                      Change
                    </Button>
                  }
                />
                <SettingCard
                  title="Email Notifications"
                  subtitle="Receive training updates and announcements via email"
                  OptionsComponent={
                    <Switch defaultChecked size="md" color="dark" />
                  }
                />
              </div>
              <Group justify="right" mt={"50"}>
                <Button
                  loading={userPending}
                  type="submit"
                  variant="filled"
                  color="dark"
                >
                  Save Changes
                </Button>
              </Group>
            </form>
          </Paper>
          <Modal
            style={{ zIndex: 100 }}
            opened={opened}
            onClose={close}
            withCloseButton={false}
            title={
              <div className="w-full flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <Text fs={"20"} fz={"20px"} fw={"bold"}>
                    Change Password
                  </Text>
                  <IconX onClick={close} />
                </div>
                <Text fs={"40"} lh={"14px"} fz={"15px"} mb={"md"} c={"#64748B"}>
                  Enter your current password and choose a new password.
                </Text>
              </div>
            }
            centered
          >
            <form onSubmit={form2.onSubmit(handleChangePassword)}>
              <div className="space-y-4">
                <TextInput
                  label="Current Password"
                  placeholder="Enter current Password"
                  {...form2.getInputProps("old_password")}
                />
                <TextInput
                  label="New Password"
                  placeholder="Enter new Password"
                  {...form2.getInputProps("new_password")}
                />
                <TextInput
                  label="Confirm New Password"
                  placeholder="Enter confirm New Password"
                  {...form2.getInputProps("new_password_confirmation")}
                />
                <div className="flex justify-end gap-2 mt-6">
                  <Button color="dark" variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={passwordPending} color="dark">
                    Update Password
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </Suspense>
  );
}
