export type Folder = {
  id: number;
  name: string;
  description: string;
  video_count: number;
  created_at: string;
};

export type FolderResponse = {
  message: string;
  folders: Folder[];
};

export type Video = {
  id: number;
  topic: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  created_at?: string;
};

export type FolderVideoResponse = {
  message: string;
  folder: string;
  folder_name?: string;
  videos: Video[];
};

export interface MarkWatchedResponse {
  message: string;
  data: {
    employee_id: string;
    video_id: string;
    viewed_at: string;
    created_at: string;
    id: number;
  };
}

// Gimbal
export interface GimbalFolderListResponse {
  message: string;
  folders: Array<{
    id: number;
    name: string;
    description: string;
    video_count: number;
    created_at: string;
  }>;
}

export interface GimbalFolderVideosResponse {
  message: string;
  folder: string;
  videos: Array<{
    id: number;
    topic: string;
    description: string;
    duration: string;
    video_url: string;
    thumbnail_url: string;
    created_at: string;
  }>;
}

export interface ConsumerVideosWatchedResponse {
  message: string;
  videos: Array<{
    video_id: number;
    topic: string;
    description_url: string;
    video_url: string;
    thumbnail_url: string;
    duration: string;
    viewed_at: string;
  }>;
}

export interface HandHeldFolderListResponse {
  message: string;
  folders: Array<{
    id: number;
    name: string;
    description: string;
    video_count: string;
    created_at: string;
  }>;
}

export interface HandheldFolderVideosResponse {
  message: string;
  folder: string;
  videos: Array<{
    id: number;
    topic: string;
    description: string;
    duration: string;
    video_url: string;
    thumbnail_url: string;
    created_at: string;
  }>;
}

export interface WatchedAgricVideo {
  video_id: number;
  topic: string;
  description: string;
  duration: string;
  watched_seconds: string;
  percentage: number;
  video_url: string;
  thumbnail_url: string;
  last_updated: string;
}

export interface WatchedAgricVideoResponse {
  message: string;
  videos: WatchedAgricVideo[];
}

export interface VideoProgressResponse {
  message: string;
  progress: {
    watched_seconds: number;
    video_duration: number;
    percentages: number;
  };
}
