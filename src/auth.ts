import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Employee } from "./types/appTypes";
import { API_ENDPOINT } from "./service/api/endpoints";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        try {
          const response = await fetch(API_ENDPOINT.LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // If the response is not ok, try to parse the error message from the JSON response
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                `Authentication failed with status ${response.status}`
            );
          }

          // Parse the JSON response once and store it
          const data = await response.json();

          return {
            id: data.employee.id,
            email: data.employee.email,
            username: data.employee.username,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt: async ({ token, user, trigger, session }) => {

      if (trigger === "update" && session?.user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        token.user = { ...token.user, ...session.user }; // Merge session.user into token.user
        return token;
      }
      if (user) {
        token.user = user as Employee; // Initial login
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.apiToken = token.apiToken as string;
      session.user = token.user as Employee;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
    signOut: "/",
    newUser: "/signup",
  },
});
