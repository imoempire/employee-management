export type SegmentValues =
  | "Welcome Message"
  | "Vision, Mission & Values"
  | "Policies"
  // | "Code of Conduct"
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

export type consumerSegmentValues = "Drones" | "Gimbal" | "Handheld Cams & Mic";

export type consumerNextSegementValue = consumerSegmentValues | null;

// Polices
export interface PolicyDocument {
  id: number;
  title: string;
  description: null;
  file_url: string;
  uploaded_at: string;
}

export interface PolicesResponse {
  message: string;
  documents: PolicyDocument[];
}

export type agricSegmentValues =
  | "Agricultural Drones"
  | "Other Onboarding Materials";

export type agricNextSegementValue = agricSegmentValues | null;
