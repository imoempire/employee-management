"use server";

import { signIn, signOut } from "@/auth";

export async function performSignIn(email: string, password: string) {
  return await signIn("credentials", {
    email: email,
    password: password,
    redirect: false,
  });
}

export async function performSignOut() {
  return await signOut({
    redirectTo: "/",
  });
}
