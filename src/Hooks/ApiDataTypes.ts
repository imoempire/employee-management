export interface ProfileResponse {
  message: string;
  profile: EmployeeProfile;
}

interface EmployeeProfile {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  start_date: string; // ISO date string (e.g., "2025-05-01")
  department: string;
  position: string;
  technical_skills: string;
  professional_bio: string;
  created_at: string; // ISO date-time string (e.g., "2025-05-22T14:05:54.000000Z")
  updated_at: string; // ISO date-time string (e.g., "2025-05-22T14:05:54.000000Z")
}

export interface Profile {
  [key: string]: string | number | undefined | null;
}
