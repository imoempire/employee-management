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
import React, { useState, useRef, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { useSession } from "next-auth/react";
import {
  FolderVideoResponse,
  MarkWatchedResponse,
  Video,
  VideoProgressResponse,
  WatchedAgricVideoResponse,
} from "../../../consumer-drones/_components/types";

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
  status?: number;
  response?: any;
}

interface VideoProgress {
  video_id: number;
  employee_id: number;
  watched_seconds: number;
  percentage: number;
  last_updated: string;
}

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  // Modal state
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Video progress tracking
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Loading state for progress updates
  const [isProgressUpdating, setIsProgressUpdating] = useState(false);

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
    url: `https://erp.mawuena.com/api/admin/agric-folder/${params.id}/videos`,
  });

  const { data: watchedVideos, refetch: refetchWatched } =
    useCustomGet<WatchedAgricVideoResponse>({
      url:
        status === "authenticated" && session?.user?.id
          ? `https://erp.mawuena.com/api/employee/${session.user.id}/agric-videos/watched`
          : null,
    });

  // Video progress API
  const { data: videoProgress, refetch: refetchVideoProgress } =
    useCustomGet<VideoProgress>({
      url:
        status === "authenticated" && selectedVideo && session?.user?.id
          ? `https://erp.mawuena.com/api/employee/${session.user.id}/agric-video/${selectedVideo.id}/progress`
          : null,
    });

  // Mock array for videos

  // Features
  const [videos, setVideos] = useState<Video[]>();
  const [isMarkingWatched, setIsMarkingWatched] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    const videos = folderVideos?.videos;
    setVideos(videos);
    return () => {};
  }, [folderVideos, watchedVideos]);

  const UPDATE_PROGRESS = useCustomPost({
    onSuccess: (data: VideoProgressResponse) => {
      console.log("Progress updated successfully:", data);
      setIsProgressUpdating(false);
      refetchWatched();
      refetchVideoProgress();
    },
    onError: (error: ApiError) => {
      console.error("Progress update failed:", error);
      setIsProgressUpdating(false);
      showNotification({
        title: "Error",
        message: error?.data?.message || "Failed to update video progress!",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
    },
    url: `https://erp.mawuena.com/api/employee/${session?.user.id}/agric-video/${selectedVideo?.id}/progress`,
  });

  const MARK_AS_WATCHED = useCustomPost({
    url:
      status === "authenticated" && session?.user?.id && currentVideoId
        ? `https://erp.mawuena.com/api/employee/${session.user.id}/consumer-video/${currentVideoId}/mark-watched`
        : null,
    onSuccess: (data: MarkWatchedResponse) => {
      setIsMarkingWatched(false);
      refetch();
      refetchWatched();
      showNotification({
        title: "Success",
        message: data?.message || "Video marked as watched!",
        color: "green",
        icon: <IconCheck />,
        position: "bottom-right",
      });
    },
    onError: (error: ApiError) => {
      setIsMarkingWatched(false);
      showNotification({
        title: "Error",
        message: error?.data?.message || "Failed to mark video as watched!",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
    },
  });

  const handleProgressUpdate = (currentTime: number) => {
    if (!selectedVideo || !session?.user?.id) return;

    setIsProgressUpdating(true);
    UPDATE_PROGRESS.mutate({
      watched_seconds: currentTime,
    });
  };

  const handleOpenVideo = async (video: Video) => {
    if (status !== "authenticated" || !session?.user?.id) {
      showNotification({
        title: "Error",
        message: "Please log in to view videos.",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
      return;
    }

    setSelectedVideo(video);
    setModalOpened(true);

    // Fetch fresh progress data
    await refetchVideoProgress();

    // Set initial progress from API sources
    const progress =
      videoProgress?.watched_seconds ||
      watchedVideos?.videos?.find((v) => v.video_id === video.id)
        ?.watched_seconds ||
      0;

    setWatchedSeconds(Number(progress));
  };

  const handleCloseModal = () => {
    // Save current progress before closing
    if (videoRef.current) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      handleProgressUpdate(currentTime);
    }

    setModalOpened(false);
    // setSelectedVideo(null);
    setWatchedSeconds(0);
  };

  const handleMarkAsWatched = (videoId: string) => {
    if (!videoId || !session?.user?.id || status !== "authenticated") {
      showNotification({
        title: "Error",
        message: "Video ID or user authentication is missing.",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
      return;
    }

    setCurrentVideoId(videoId);
    setIsMarkingWatched(true);
    MARK_AS_WATCHED.mutate(null, {
      onSettled: () => setIsMarkingWatched(false),
    });
  };

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    const currentTime = Math.floor(video.currentTime);
    setWatchedSeconds(currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && watchedSeconds > 0) {
      videoRef.current.currentTime = watchedSeconds;
    }
  };

  const handlePauseOrEnd = () => {
    if (videoRef.current) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      handleProgressUpdate(currentTime);
    }
  };

  const isVideoCompleted = (videoId: number): boolean => {
    return (
      watchedVideos?.videos?.some(
        (watchedVideo) =>
          watchedVideo.video_id === videoId &&
          watchedVideo.last_updated &&
          watchedVideo.percentage >= 99
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
                {folderVideos?.folder_name || "N/A"}
              </Title>
              <Text size="lg" c="#64748b">
                {videos?.length || 0} videos in this folder
              </Text>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <Skeleton height={200} key={i} />
              ))}
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

                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                    <div
                      onClick={() => handleOpenVideo(video)}
                      className="bg-white backdrop-blur-sm rounded-full p-4 opacity-100"
                    >
                      <IconPlayerPlay size={32} color="black" />
                    </div>
                  </div>

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
                          <Image
                            src={"/icons8-checkmark-96.png"}
                            h={20}
                            alt="check"
                          />
                        ) : (
                          " 👍"
                        )
                      }
                      color="dark"
                      radius="md"
                      onClick={() => handleMarkAsWatched(video.id.toString())}
                      loading={
                        currentVideoId === video.id.toString() &&
                        isMarkingWatched
                      }
                    >
                      {isCompleted ? "Completed" : "I'm done"}
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

      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={selectedVideo?.topic}
        size="80%"
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
                ref={videoRef}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPause={handlePauseOrEnd}
                onEnded={handlePauseOrEnd}
              >
                <source src={selectedVideo.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </AspectRatio>

            <div style={{ padding: "1rem 0", color: "#fff" }}>
              <Text size="sm" c="dimmed" mb="xs">
                {selectedVideo.description}
              </Text>
              <Group align="center" gap={8} mb="xs">
                <IconClock size={16} stroke={1.5} color="#64748B" />
                <Text size="sm" c="dimmed">
                  Duration:{" "}
                  {selectedVideo?.duration ? selectedVideo?.duration : "N/A"}
                </Text>
              </Group>
              <Group align="center" gap={8}>
                <Text size="sm" c="dimmed">
                  Progress: {Math.floor(watchedSeconds / 60)}:
                  {(watchedSeconds % 60).toString().padStart(2, "0")}
                  {videoProgress?.percentage
                    ? ` (${videoProgress.percentage}% watched)`
                    : ""}
                </Text>
                {isProgressUpdating && (
                  <Text size="sm" c="dimmed">
                    Updating progress...
                  </Text>
                )}
              </Group>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
