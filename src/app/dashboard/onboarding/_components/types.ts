export type SegmentValues =
  | "Welcome Message"
  | "Vision, Mission & Values"
  | "Policies"
  | "Code of Conduct"
  | "Organizational Structure";

export type NextSegementValue = SegmentValues | null;

export type droneSegmentValues =
  | "Onboarding Videos"
  | "Onboarding Materials"
  | "Onboarding Quicklinks";

export type dronNextSegementValue = droneSegmentValues | null;

// VIDEOS
export interface VideosData {
  id: number;
  topic: string;
  description: string;
  video_path: string;
  created_at: string;
  updated_at: string;
  duration?: string;
  thumbnail_path: string;
}

export interface VideosResponse {
  message: string;
  videos: VideosData[];
}

export type consumerSegmentValues =
  | "Drones"
  | "Gimbal"
  | "Handheld Cams & Mic";

export type consumerNextSegementValue = consumerSegmentValues | null;
