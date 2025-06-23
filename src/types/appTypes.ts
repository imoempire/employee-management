export type Employee = {
  id: number;
  username: string;
  email: string;
  accessToken?: string;
  emailVerified: Date | null; // Make it non-optional to satisfy AdapterUser
  name?: string; // From User
  image?: string; // From User
};
