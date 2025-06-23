"use client";
import { Button, Group, Paper, Switch } from "@mantine/core";
import React, { Suspense } from "react";
import { TextField } from "./_components/TextField";
import { SelectField } from "./_components/SelectField";
import SettingCard from "./_components/Card";
import Loading from "@/components/loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between mb-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-0.5">Employee Settings</h1>
              <p className="text-xl">
                Manage your account preferences and notification settings
              </p>
            </div>
          </div>
          <Paper shadow="md" withBorder p={"md"} mb={"xl"}>
            <div>
              <h1 className="text-2xl font-bold">Account Preferences</h1>
              <p className="text-md text-[#64748B]">
                Manage how your account appears and works
              </p>
            </div>
            <div className="flex flex-col gap-y-6 mt-8">
              <TextField
                label="Display Name"
                placeholder="Enter your name"
                caption="This is how your name will appear in the employee portal"
                required
                onChange={(e) => console.log(e.target.value)}
              />
              <SelectField
                label="Language"
                placeholder="English"
                caption="Select your preferred language for the portal"
                data={["English", "Spanish", "French"]}
                required
                onChange={(value) => console.log(value)}
              />
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
              <SettingCard
                title="SMS Notifications"
                subtitle="Receive text messages for urgent notifications"
                OptionsComponent={<Switch size="md" color="dark" />}
              />
            </div>

            <Group justify="right" mt={"50"}>
              <Button variant="default">Reset to Defaults</Button>
              <Button variant="default">Back to Profile</Button>
              <Button variant="filled" color="dark">
                Save Changes
              </Button>
            </Group>
          </Paper>
          <Paper shadow="md" withBorder p={"md"}>
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
          </Paper>
        </div>
      </div>
    </Suspense>
  );
}
