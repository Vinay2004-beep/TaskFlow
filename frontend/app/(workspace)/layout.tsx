"use client";

import type React from "react";
import { motion } from "framer-motion";

import { AppShell } from "@/components/layout/app-shell";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.985,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="relative min-h-screen overflow-hidden"
      >
        {/* FLOATING GLOW EFFECTS */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[-100px] top-[-100px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
          />

          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[-120px] right-[-80px] h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/5 blur-3xl"
          />
        </div>

        {/* PAGE CONTENT */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </AppShell>
  );
}