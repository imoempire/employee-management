/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  Button,
  Group,
  Box,
  Modal,
  AspectRatio,
  Center,
  Stack,
} from "@mantine/core";
import {
  IconCheck,
  IconClock,
  IconMoodEmpty,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { VideosData, VideosResponse } from "../../_components/types";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { showNotification } from "@mantine/notifications";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { useSession } from "next-auth/react";

interface OnboardingVideo {
  onboarding_video_id: number;
  topic: string;
  description: string;
  duration: number | null;
  watched: boolean;
  viewed_at: string | null;
}

interface VideoViewStatusResponse {
  message: string;
  videos: OnboardingVideo[];
}

interface MarkAsWatchedResponse {
  message: string;
  success: boolean;
}

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export default function OnboardingVideos({
  setCompleted,
  setNumberVideos,
}: {
  setCompleted: Dispatch<SetStateAction<number>>;
  setNumberVideos: Dispatch<SetStateAction<number>>;
}) {
  const { data } = useSession();

  // Modal state
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideosData | null>(null);

  // DATA API
  const { data: watchedVideos, refetch: refetch1 } =
    useCustomGet<VideoViewStatusResponse>({
      url: `https://erp.mawuena.com/api/employee/${data?.user.id}/ent-onboarding-video-views`,
    });

  // DATA API
  const { data: entVideos, refetch: refetch2 } = useCustomGet<VideosResponse>({
    url: `https://erp.mawuena.com/api/admin/ent-onboarding-video/list`,
  });
  const onboardingVideos = entVideos?.videos;

  const getSafeUrl2 = (path: string) => {
    const originalUrl = `https://erp.mawuena.com/storage/${path}`;
    return originalUrl;
  };

  const VideoThumbnail = ({
    thumbnailPath,
    alt,
  }: {
    videoPath: string;
    thumbnailPath: string | null;
    alt: string;
  }) => {
    return (
      <Box>
        {thumbnailPath ? (
          <Image
            src={getSafeUrl2(thumbnailPath)}
            className="h-[160px]"
            alt={alt}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <Box
            style={{
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: 4,
            }}
          >
            <IconPlayerPlay size={48} color="#64748B" />
          </Box>
        )}
      </Box>
    );
  };

  const [isloading, setIsLoading] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const MARK_AS_WATCHED = useCustomPost({
    url:
      data?.user?.id && currentVideoId
        ? `https://erp.mawuena.com/api/employee/${data.user.id}/onboarding-video/${currentVideoId}/watched`
        : ``,
    onSuccess: (data: MarkAsWatchedResponse) => {
      refetch1();
      refetch2();
      showNotification({
        title: "Success",
        message: data?.message || "Video marked as watched!",
        color: "green",
        icon: <IconCheck />,
        position: "bottom-right",
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to mark video as watched:", error);
      showNotification({
        title: "Error",
        message: error?.data?.message || "Something went wrong!",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
    },
  });

  const handleMarkAsWatched = (videoId: string) => {
    if (!videoId || !data?.user?.id) {
      showNotification({
        title: "Error",
        message: "Video ID or User ID is missing.",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
      return;
    }

    setCurrentVideoId(videoId);
    setIsLoading(true);
    MARK_AS_WATCHED.mutate(null, {
      onSettled: () => setIsLoading(false),
    });
  };

  // Helper function to check if video is completed based on watchedVideos data
  const isVideoCompleted = (videoId: number): boolean => {
    return (
      watchedVideos?.videos?.some(
        (watchedVideo) =>
          watchedVideo.onboarding_video_id === videoId && watchedVideo.watched
      ) || false
    );
  };

  useEffect(() => {
    if (watchedVideos?.videos) {
      setCompleted(watchedVideos?.videos.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedVideos?.videos]);

  useEffect(() => {
    if (onboardingVideos) {
      setNumberVideos(onboardingVideos?.length || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingVideos]);

  // Handle opening video in modal
  const handleOpenVideo = (video: any) => {
    setSelectedVideo(video);
    setModalOpened(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedVideo(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {onboardingVideos?.map((video) => {
          const isCompleted = isVideoCompleted(video?.id);
          return (
            <Card key={video?.id} shadow="sm" px="lg" radius="md" withBorder>
              <Card.Section className="relative group cursor-pointer">
                <VideoThumbnail
                  videoPath={video?.video_path}
                  thumbnailPath={video?.thumbnail_path}
                  alt={video?.topic}
                />

                {/* Hover overlay with play icon */}
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                  <div
                    onClick={() => handleOpenVideo(video)}
                    className="bg-white backdrop-blur-sm rounded-full p-4 opacity-100"
                  >
                    <IconPlayerPlay size={32} color="black" />
                  </div>
                </div>

                {/* Completion badge */}
                {isCompleted && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <IconCheck />
                  </div>
                )}
              </Card.Section>

              <Group flex={1} justify="space-between">
                <Group justify="space-between" mt="md" mb="xs">
                  <Text fs="80" fw={700}>
                    {video.topic}
                  </Text>
                </Group>

                {/* <Text size="sm" c="dimmed" truncate>
                {video.description}
              </Text> */}

                <Group w="100%" justify="space-between" align="center">
                  <Group align="center" gap={2}>
                    <IconClock size={20} stroke={1.5} color="#64748B" />
                    <Text size="sm" c="#64748B">
                      {video?.duration ? video?.duration : "N/A"}
                    </Text>
                  </Group>
                  <Button
                    leftSection={
                      isCompleted ? (
                        <Image src={"/icons8-checkmark-96.png"} h={20} />
                      ) : (
                        " 👍"
                      )
                    }
                    color="dark"
                    radius="md"
                    onClick={() => handleMarkAsWatched(video.id.toString())}
                    loading={
                      currentVideoId === video.id.toString() && isloading
                    }
                  >
                    {isCompleted ? "Completed" : "I’m done"}
                  </Button>
                </Group>
              </Group>
            </Card>
          );
        })}
      </div>

      <div>
        {onboardingVideos?.length === 0 && (
          <div className="flex-1 mt-5">
            <Center>
              <Stack gap={2} align="center" justify="center">
                <IconMoodEmpty color="gray" />
                <Text c="dimmed">No data available</Text>
              </Stack>
            </Center>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={selectedVideo?.topic}
        size="xl"
        centered
        styles={{
          content: {
            backgroundColor: "#000",
          },
          header: {
            backgroundColor: "#000",
            color: "#fff",
            borderBottom: "1px solid #333",
          },
          title: {
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.2rem",
          },
          close: {
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
          },
        }}
      >
        {selectedVideo && (
          <div>
            <AspectRatio ratio={16 / 9}>
              <video
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                }}
                onEnded={() => {
                  // Optionally mark as watched when video ends
                  if (!isVideoCompleted(selectedVideo.id)) {
                    handleMarkAsWatched(selectedVideo.id.toString());
                  }
                }}
              >
                <source
                  src={getSafeUrl2(selectedVideo.video_path)}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </AspectRatio>

            {/* Video Details */}
            <div style={{ padding: "1rem 0", color: "#fff" }}>
              <Text size="sm" c="dimmed" mb="xs">
                {selectedVideo.description}
              </Text>
              <Group align="center" gap={8}>
                <IconClock size={16} stroke={1.5} color="#64748B" />
                <Text size="sm" c="dimmed">
                  Duration:{" "}
                  {selectedVideo?.duration ? selectedVideo?.duration : "N/A"}
                </Text>
              </Group>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
