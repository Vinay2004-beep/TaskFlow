"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { motion } from "framer-motion";

import {
  TrendingUp,
  Activity,
  Users,
  Sparkles,
} from "lucide-react";

import type { Dashboard } from "@/types";

const colors = [
  "#14b8a6",
  "#f97316",
  "#2563eb",
  "#8b5cf6",
];

export function DashboardCharts({
  data,
}: {
  data: Dashboard;
}) {
  const productivityData = [
    { day: "Mon", completed: 2 },
    { day: "Tue", completed: 4 },
    { day: "Wed", completed: 3 },
    { day: "Thu", completed: 6 },
    { day: "Fri", completed: 5 },
    { day: "Sat", completed: 7 },
    { day: "Sun", completed: 8 },
  ];

  return (
    <div className="grid gap-7 xl:grid-cols-2">

      {/* PIE CHART */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Tasks by Status
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Live workflow distribution
              </p>
            </div>
          </div>

          <div className="rounded-full bg-cyan-500/10 px-4 py-1 text-xs font-semibold text-cyan-400">
            LIVE
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.byStatus}
              dataKey="count"
              nameKey="status"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={5}
              label={({ name, percent, x, y }) => (
                <text
                  x={x}
                  y={y}
                  fill="currentColor"
                  className="fill-slate-900 dark:fill-white text-[12px] font-semibold"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {name} {Math.round((percent || 0) * 100)}%
                </text>
              )}
            >
              {data.byStatus.map((_, i) => (
                <Cell
                  key={i}
                  fill={colors[i % colors.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* BAR CHART */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-orange-500/10 p-3">
              <Users className="h-6 w-6 text-orange-400" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Tasks per User
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Team productivity insights
              </p>
            </div>
          </div>

          <div className="rounded-full bg-orange-500/10 px-4 py-1 text-xs font-semibold text-orange-400">
            ANALYTICS
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.byUser}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="name"
              stroke="#94a3b8"
            />

            <YAxis
              allowDecimals={false}
              stroke="#94a3b8"
            />

            <Tooltip />

            <Bar
              dataKey="count"
              fill="#14b8a6"
              radius={[14, 14, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AREA CHART */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 xl:col-span-2"
      >
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-blue-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Productivity Trend
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Weekly team performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1 text-xs font-semibold text-blue-400">
            <Sparkles className="h-3 w-3" />
            WEEKLY
          </div>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={productivityData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#3b82f6"
              strokeWidth={4}
              fill="#3b82f6"
              fillOpacity={0.25}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
