import { AspectRatio, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { NextSegementValue } from "./types";

export default function Welcome({
  NextSegement,
}: {
  NextSegement: (value: NextSegementValue) => void;
}) {
  const isDocAccepted: boolean = false;

  const handleSubmit = async () => {
    try {
      //   setisloading(true);
      //   POST_ACTION.mutate(null);
      NextSegement("Vision, Mission & Values");
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
      <AspectRatio ratio={2.5}>
        <div className="flex justify-center items-center">
          <video
            controls
            autoPlay
            style={{
              width: "60%",
              height: "100%",
              backgroundColor: "#000",
            }}
            //   onEnded={() => {
            //     // Optionally mark as watched when video ends
            //     if (!isVideoCompleted(selectedVideo.id)) {
            //       handleMarkAsWatched(selectedVideo.id.toString());
            //     }
            //   }}
          >
            <source
              src={
                "https://erp.mawuena.com/storage/intro_video/Adk Onboarding_v1.mp4"
              }
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </AspectRatio>

      <div className="mt-8">
        {!isDocAccepted && (
          <Group justify="space-between">
            <Button component={Link} href={"/dashboard"} variant="default">
              Back to Dashboard
            </Button>
            <Button
              onClick={handleSubmit}
              //   loading={isloading}
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
