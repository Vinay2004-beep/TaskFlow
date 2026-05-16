"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart3,
  FolderKanban,
  LogOut,
  UserRound,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationsDropdown } from "@/components/layout/notifications";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, router, user]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute bottom-[-140px] right-[-100px] h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-slate-800 bg-slate-950/70 p-5 backdrop-blur-2xl lg:block">
        
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/dashboard"
            className="mb-10 flex items-center gap-3"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30">
              <FolderKanban className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                TaskFlow
              </h1>

              <p className="text-xs text-slate-400">
                Smart Workspace
              </p>
            </div>
          </Link>
        </motion.div>

        {/* NAVIGATION */}
        <nav className="space-y-3">
          {[
            {
              href: "/dashboard",
              icon: BarChart3,
              label: "Dashboard",
            },
            {
              href: "/profile",
              icon: UserRound,
              label: "Profile",
            },
          ].map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10"
              >
                <item.icon className="h-5 w-5 text-cyan-400 transition group-hover:scale-110" />

                <span className="font-medium text-slate-200">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* PREMIUM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/20">
              <Sparkles className="h-6 w-6 text-cyan-400" />
            </div>

            <div>
              <h3 className="font-bold text-white">
                Premium Workspace
              </h3>

              <p className="text-xs text-slate-400">
                Interactive analytics enabled
              </p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.4 }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Workspace performance: 78%
          </p>
        </motion.div>
      </aside>

      {/* CONTENT */}
      <div className="relative z-10 lg:pl-72">
        
        {/* HEADER */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/50 px-5 backdrop-blur-2xl md:px-10">
          
          <Link
            href="/dashboard"
            className="flex items-center gap-3 font-black lg:hidden"
          >
            <FolderKanban className="h-6 w-6 text-cyan-400" />

            <span>TaskFlow</span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />

            <NotificationsDropdown />

            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              className="rounded-xl border border-slate-700 bg-slate-900/50 hover:border-red-500/40 hover:bg-red-500/10"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <motion.main
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="relative z-10 p-5 md:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}