"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FolderKanban,
  CheckCircle2,
  Users,
} from "lucide-react";

type Props = {
  projects: number;
  tasks: number;
  members: number;
};

export function StatsCards({
  projects,
  tasks,
  members,
}: Props) {
  const stats = [
    {
      title: "Projects",
      value: projects,
      icon: FolderKanban,
      color:
        "from-cyan-500 via-blue-500 to-indigo-500",
    },
    {
      title: "Tasks",
      value: tasks,
      icon: CheckCircle2,
      color:
        "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
      title: "Members",
      value: members,
      icon: Users,
      color:
        "from-orange-500 via-rose-500 to-red-500",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.12,
          }}
          whileHover={{
            scale: 1.03,
            y: -5,
          }}
          className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.color} p-[1px]`}
        >
          <div className="absolute inset-0 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 bg-cyan-500/20" />

          <div className="relative rounded-3xl bg-slate-950/95 p-6 backdrop-blur-xl">
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-3 text-5xl font-black text-white">
                  <CountUp
                    end={item.value}
                    duration={2}
                  />
                </h2>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <item.icon className="h-8 w-8 text-cyan-400" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live analytics
            </div>

            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-1000 group-hover:translate-x-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}