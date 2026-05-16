"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";

import { useToast } from "@/components/ui/toast";

import { ProjectForm } from "@/components/forms/project-form";

import { StatsCards } from "@/components/dashboard/stats-cards";

import { api } from "@/services/api";

import type { Project } from "@/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    api
      .get<Project[]>("/projects")
      .then(({ data }) => setProjects(data))
      .finally(() => setLoading(false));
  }, []);

  async function createProject(values: {
    name: string;
    description: string;
  }) {
    const { data } = await api.post<Project>(
      "/projects",
      values
    );

    setProjects((items) => [data, ...items]);

    setOpen(false);

    toast({
      title: "Project created",
      description: `${data.name} is ready.`,
    });
  }

  const totalTasks = projects.reduce(
    (acc, item) => acc + (item._count?.tasks ?? 0),
    0
  );

  const totalMembers = projects.reduce(
    (acc, item) => acc + item.members.length,
    0
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">

      {/* BACKGROUND GLOW */}
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tight"
            >
              Project Workspace
            </motion.h1>

            <p className="mt-3 text-lg text-slate-400">
              Manage projects, monitor analytics, and collaborate with your team.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 rounded-2xl bg-cyan-500 px-6 text-black transition hover:scale-105 hover:bg-cyan-400">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>

            <DialogContent className="border-slate-800 bg-slate-950 text-white">
              <DialogHeader>
                <DialogTitle>Create project</DialogTitle>

                <DialogDescription>
                  Start a new collaborative workspace.
                </DialogDescription>
              </DialogHeader>

              <ProjectForm onSubmit={createProject} />
            </DialogContent>
          </Dialog>
        </div>

        {/* PREMIUM STATS */}
        <StatsCards
          projects={projects.length}
          tasks={totalTasks}
          members={totalMembers}
        />

        {/* LOADING */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                className="h-64 rounded-3xl bg-slate-800"
              />
            ))}
          </div>
        ) : null}

        {/* EMPTY */}
        {!loading && !projects.length ? (
          <Card className="border border-slate-800 bg-slate-900/70 text-white backdrop-blur-xl">
            <CardContent className="grid place-items-center py-24 text-center">

              <FolderKanban className="mb-5 h-20 w-20 text-cyan-400" />

              <p className="text-3xl font-black">
                No projects yet
              </p>

              <p className="mt-3 max-w-md text-slate-400">
                Create your first workspace to unlock analytics, Kanban boards, and real-time collaboration.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {/* PROJECTS */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const currentMembership = project.members[0];

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                }}
              >
                <Link href={`/projects/${project.id}`}>

                  <Card className="group relative h-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]">

                    {/* GLOW LINE */}
                    <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400" />

                    {/* SHINE EFFECT */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-1000 group-hover:translate-x-full" />

                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">

                        <CardTitle className="text-2xl text-white">
                          {project.name}
                        </CardTitle>

                        {currentMembership?.role === "ADMIN" ? (
                          <Badge className="border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-800 text-slate-300">
                            Member
                          </Badge>
                        )}
                      </div>

                      <CardDescription className="line-clamp-2 text-slate-400">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>

                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>
                          {project.members.length} members
                        </span>

                        <span>
                          {project._count?.tasks ?? 0} tasks
                        </span>
                      </div>

                      {/* AVATARS */}
                      <div className="mt-6 flex -space-x-3">
                        {project.members
                          .slice(0, 5)
                          .map((member) => (
                            <motion.div
                              whileHover={{
                                scale: 1.1,
                                y: -2,
                              }}
                              key={member.id}
                              className="grid h-12 w-12 place-items-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-cyan-500 to-blue-500 text-sm font-bold text-white shadow-xl"
                            >
                              {member.user.name
                                .slice(0, 2)
                                .toUpperCase()}
                            </motion.div>
                          ))}
                      </div>

                    </CardContent>
                  </Card>

                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}