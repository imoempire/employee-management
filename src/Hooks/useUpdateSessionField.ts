/* eslint-disable @typescript-eslint/no-explicit-any */
import { Employee } from "@/types/appTypes";
import { useSession } from "next-auth/react";

const ALLOWED_SESSION_FIELDS: (keyof Employee)[] = [
  "username",
  "email",
  "image",
  "name",
];

export const useUpdateSessionField = () => {
  const { update } = useSession();

  const updateUserField = async (field: keyof Employee, value: any) => {
    if (!ALLOWED_SESSION_FIELDS.includes(field)) {
      console.warn(`Field "${field}" is not allowed to be updated in the session.`);
      return;
    }
console.log("Heloo");

    await update({
      user: {
        [field]: value,
      },
    });
  };

  return updateUserField;
};
