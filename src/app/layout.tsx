import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import ReactQueryProvider from "./context/ReactQueryProvider";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmployeeHub | Management",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <html lang="en" {...mantineHtmlProps}>
          <head>
            <ColorSchemeScript />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <MantineProvider>
              <Notifications />
              {children}
            </MantineProvider>
          </body>
        </html>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
