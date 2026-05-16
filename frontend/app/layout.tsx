import type { Metadata } from "next";
import type React from "react";

import "./globals.css";

import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "TaskFlow | Premium Team Workspace",

  description:
    "Modern collaborative workspace with realtime Kanban boards, analytics dashboards, smart team management, and productivity tracking.",

  keywords: [
    "TaskFlow",
    "Task Manager",
    "Kanban Board",
    "Project Management",
    "Team Collaboration",
    "Next.js SaaS",
  ],

  authors: [
    {
      name: "Vinay Saraswat",
    },
  ],

  openGraph: {
    title:
      "TaskFlow | Premium Team Workspace",

    description:
      "Realtime project collaboration with modern dashboards and Kanban workflow.",

    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className="
          min-h-screen
          bg-[#020617]
          text-white
          antialiased
        "
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}