import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "TaskFlow | Team Task Manager",
  description: "A production-ready team task manager with projects, roles, Kanban, analytics, and real-time updates."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
