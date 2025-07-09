export type profileEmployee = {
id: string;
username: string;
  email: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
};

export interface SettingProfileResponse {
  message: string;
  employee: profileEmployee;
}
