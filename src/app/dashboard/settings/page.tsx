"use client";
import { Avatar, Button, Group, Indicator, Paper, Switch } from "@mantine/core";
import React, { Suspense, useRef, useState } from "react";
import { TextField } from "./_components/TextField";
// import { SelectField } from "./_components/SelectField";
import SettingCard from "./_components/Card";
import Loading from "@/components/loading";
import { IconAdjustmentsHorizontal, IconCamera } from "@tabler/icons-react";

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const handleIndicatorClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarImage(imageUrl);
      console.log("Selected file:", file);
    }
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
              <div className="flex justify-center ">
                <Indicator
                  inline
                  size={35}
                  offset={13}
                  position="bottom-end"
                  color="dark"
                  label={<IconCamera size={20} />}
                  onClick={handleIndicatorClick}
                  style={{ cursor: "pointer" }}
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
              <div>
                <p className="text-md text-[#64748b] font-medium text-center">
                  Click the camera icon to change your profile picture
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-y-6 mt-8">
              <TextField
                label="Display Name"
                placeholder="Enter your name"
                caption="This is how your name will appear in the employee portal"
                styles={{
                  label: {
                    fontSize: 16,
                    fontWeight: "600",
                  },
                }}
                required
                onChange={(e) => console.log(e.target.value)}
              />
              <SettingCard
                title="Change Password"
                subtitle="Update your account password"
                OptionsComponent={<Button variant="default">Change</Button>}
              />
              {/* <SelectField
                label="Language"
                placeholder="English"
                caption="Select your preferred language for the portal"
                data={["English", "Spanish", "French"]}
                required
                onChange={(value) => console.log(value)}
              /> */}
              {/* <SelectField
              label="Theme"
              placeholder="System"
              caption="Choose your preferred visual theme"
              data={["System", "Dark", "Light"]}
              required
              onChange={(value) => console.log(value)}
            /> */}
              <SettingCard
                title="Email Notifications"
                subtitle="Receive training updates and announcements via email"
                OptionsComponent={
                  <Switch defaultChecked size="md" color="dark" />
                }
              />
              {/* <SettingCard
                title="SMS Notifications"
                subtitle="Receive text messages for urgent notifications"
                OptionsComponent={<Switch size="md" color="dark" />}
              /> */}
            </div>

            <Group justify="right" mt={"50"}>
              {/* <Button variant="default">Reset to Defaults</Button> */}
              {/* <Button variant="default">Back to Profile</Button> */}
              <Button variant="filled" color="dark">
                Save Changes
              </Button>
            </Group>
          </Paper>
          {/* <Paper shadow="md" withBorder p={"md"}>
            <div>
              <h1 className="text-2xl font-bold">Privacy & Security</h1>
              <p className="text-md text-[#64748B]">
                Manage your account security settings
              </p>
            </div>
            <div className="flex flex-col gap-y-6 mt-8">
              <SettingCard
                title="Change Password"
                subtitle="Update your account password"
                OptionsComponent={<Button variant="default">Change</Button>}
              />
              <SettingCard
                title="Two-Factor Authentication"
                subtitle="Add an extra layer of security to your account"
                OptionsComponent={<Button variant="default">Change</Button>}
              />
            </div>
          </Paper> */}
        </div>
      </div>
    </Suspense>
  );
}
