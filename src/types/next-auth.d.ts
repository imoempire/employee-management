import type {
  User as AuthUser,
  AdapterUser as AuthAdapterUser,
  DefaultSession,
} from "next-auth";
import { Employee } from "./types/appTypes";

declare module "next-auth" {
  // Override User type
  interface User extends Omit<AuthUser, "id"> {
    id: number;
    username: string;
    email: string;
    accessToken?: string;
    emailVerified?: Date | null;
    name?: string;
    image?: string;
  }

  // Override AdapterUser type
  interface AdapterUser extends Omit<AuthAdapterUser, "id"> {
    id: number;
    username: string;
    email: string;
    accessToken?: string;
    emailVerified: Date | null;
    name?: string;
    image?: string;
  }

  // Extend session interface
  interface Session extends DefaultSession {
    user: Employee;
    apiToken: string;
  }

  // Override JWT token to include user as Employee
  interface JWT {
    user: Employee;
    apiToken: string;
  }
}