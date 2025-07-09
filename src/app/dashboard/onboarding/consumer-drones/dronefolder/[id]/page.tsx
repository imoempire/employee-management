/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCustomGet } from "@/Hooks/useCustomGet";
import {
  Box,
  Button,
  Card,
  Group,
  Text,
  Title,
  Image,
  AspectRatio,
  Modal,
  Center,
  Stack,
  Skeleton,
} from "@mantine/core";
import {
  IconArrowNarrowLeft,
  IconCheck,
  IconClock,
  IconMoodEmpty,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  ConsumerVideosWatchedResponse,
  FolderVideoResponse,
  MarkWatchedResponse,
  Video,
} from "../../_components/types";
import { showNotification } from "@mantine/notifications";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { useSession } from "next-auth/react";

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export default function Page() {
  const { data } = useSession();

  const params = useParams<{ id: string }>();

  const router = useRouter();

  // Modal state
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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
            src={thumbnailPath}
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

  // DATA API
  const {
    data: folderVideos,
    refetch,
    isLoading,
  } = useCustomGet<FolderVideoResponse>({
    url: `https://erp.mawuena.com/api/admin/consumer-folder/${params.id}/videos`,
  });

  // DATA API
  const { data: watchedVideos, refetch: refetch1 } =
    useCustomGet<ConsumerVideosWatchedResponse>({
      url: `https://erp.mawuena.com/api/employee/${data?.user.id}/consumer-videos-watched`,
    });

  // Mock array for videos
  const videos = folderVideos?.videos;

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

  // Features
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const MARK_AS_WATCHED = useCustomPost({
    url:
      data?.user?.id && currentVideoId
        ? `https://erp.mawuena.com/api/employee/${data.user.id}/consumer-video/${currentVideoId}/mark-watched`
        : ``,
    onSuccess: (data: MarkWatchedResponse) => {
      refetch();
      refetch1();
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

  const isVideoCompleted = (videoId: number): boolean => {
    return (
      watchedVideos?.videos?.some(
        (watchedVideo) =>
          watchedVideo.video_id === videoId && watchedVideo.viewed_at
      ) || false
    );
  };

  return (
    <div>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <Button
            onClick={() => router.back()}
            variant="default"
            leftSection={<IconArrowNarrowLeft />}
          >
            Back
          </Button>
          <div className="flex gap-0 flex-col justify-center items-start sm:flex-row sm:justify-between sm:items-center">
            <div className="order-last sm:order-first">
              <Title order={2} c={"#1e2939"}>
                {folderVideos?.folder || "N/A"}
              </Title>
              <Text size="lg" c="#64748b">
                {videos?.length || 0} videos in this folder
              </Text>
            </div>
          </div>
        </div>

        {/* Videos */}
        {isLoading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(4)
              .fill(null)
              .map((_, i) => {
                return <Skeleton height={200} key={i} />;
              })}
          </div>
        )}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos?.map((video) => {
            const isCompleted = isVideoCompleted(video?.id);
            return (
              <Card key={video.id} shadow="sm" px="lg" radius="md" withBorder>
                <Card.Section className="relative group cursor-pointer">
                  <VideoThumbnail
                    videoPath={video.video_url}
                    thumbnailPath={video.thumbnail_url}
                    alt={video.topic}
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
                        {video.duration}
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
        <div className="flex-1 w-full pt-20">
          {videos?.length === 0 && !isLoading && (
            <Center>
              <Stack gap={2} align="center" justify="center">
                <IconMoodEmpty color="gray" />
                <Text c="dimmed">No data available</Text>
              </Stack>
            </Center>
          )}
        </div>
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
                // onEnded={() => {
                //   // Optionally mark as watched when video ends
                //   if (!isVideoCompleted(selectedVideo.id)) {
                //     handleMarkAsWatched(selectedVideo.id.toString());
                //   }
                // }}
              >
                <source src={selectedVideo.video_url} type="video/mp4" />
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
