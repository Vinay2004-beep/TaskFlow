"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search, UserPlus, Users } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/charts";
import { TaskForm } from "@/components/forms/task-form";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { api } from "@/services/api";
import type { Dashboard, Project, Role, Task } from "@/types";

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { user } = useAuth();
  const socket = useSocket(projectId);
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"updatedAt" | "dueDate">("updatedAt");
  const [taskDialog, setTaskDialog] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");

  const role: Role = useMemo(() => project?.members.find((member) => member.user.id === user?.id)?.role ?? "MEMBER", [project, user]);

  useEffect(() => {
    Promise.all([
      api.get<Project>(`/projects/${projectId}`),
      api.get<Task[]>(`/projects/${projectId}/tasks`),
      api.get<Dashboard>(`/projects/${projectId}/dashboard`)
    ]).then(([projectRes, tasksRes, dashboardRes]) => {
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setDashboard(dashboardRes.data);
    }).finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("task:created", (task: Task) => setTasks((items) => [task, ...items.filter((item) => item.id !== task.id)]));
    socket.on("task:updated", (task: Task) => setTasks((items) => items.map((item) => item.id === task.id ? task : item)));
    socket.on("task:deleted", ({ id }: { id: string }) => setTasks((items) => items.filter((item) => item.id !== id)));
    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
    };
  }, [socket]);

  const visibleTasks = useMemo(() => {
    const needle = search.toLowerCase();
    return [...tasks]
      .filter((task) => task.title.toLowerCase().includes(needle) || task.description.toLowerCase().includes(needle))
      .sort((a, b) => sort === "dueDate" ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tasks, search, sort]);

  async function createTask(values: any) {
    const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, values);
    setTasks((items) => [data, ...items]);
    setTaskDialog(false);
    toast({ title: "Task created", description: data.title });
  }

  async function addMember() {
    const { data } = await api.post<Project>(`/projects/${projectId}/members`, { email: memberEmail });
    setProject(data);
    setMemberEmail("");
    toast({ title: "Member added" });
  }

  async function removeMember(memberId: string) {
    await api.delete(`/projects/${projectId}/members/${memberId}`);
    setProject((item) => item ? { ...item, members: item.members.filter((member) => member.user.id !== memberId) } : item);
  }

  if (loading || !project) return <div className="space-y-4"><Skeleton className="h-28" /><Skeleton className="h-96" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-bold">{project.name}</h1><Badge>{role}</Badge></div>
          <p className="mt-2 max-w-3xl text-muted-foreground">{project.description}</p>
        </div>
        {role === "ADMIN" ? (
          <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Create task</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Create task</DialogTitle></DialogHeader><TaskForm members={project.members} onSubmit={createTask} /></DialogContent>
          </Dialog>
        ) : null}
      </div>

      {dashboard ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[["Total tasks", dashboard.totalTasks], ["Completed", dashboard.completedTasks], ["Overdue", dashboard.overdueTasks]].map(([label, value]) => (
            <motion.div key={label as string} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">{label}</div><div className="mt-2 text-3xl font-bold">{value}</div></CardContent></Card>
            </motion.div>
          ))}
        </div>
      ) : null}

      {dashboard ? <DashboardCharts data={dashboard} /> : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_21rem]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={sort} onChange={(e) => setSort(e.target.value as "updatedAt" | "dueDate")}>
              <option value="updatedAt">Sort by recent</option>
              <option value="dueDate">Sort by due date</option>
            </select>
          </div>
          <KanbanBoard projectId={projectId} role={role} members={project.members} tasks={visibleTasks} setTasks={setTasks} />
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Team</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
                  <div><div className="text-sm font-medium">{member.user.name}</div><div className="text-xs text-muted-foreground">{member.user.email}</div></div>
                  <Badge>{member.role}</Badge>
                  {role === "ADMIN" && member.role !== "ADMIN" ? <Button variant="ghost" size="sm" onClick={() => void removeMember(member.user.id)}>Remove</Button> : null}
                </div>
              ))}
              {role === "ADMIN" ? (
                <div className="space-y-2 pt-2">
                  <Label>Add member by email</Label>
                  <div className="flex gap-2"><Input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="maya@example.com" /><Button size="icon" onClick={() => void addMember()} aria-label="Add member"><UserPlus className="h-4 w-4" /></Button></div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          {dashboard ? (
            <Card><CardHeader><CardTitle>Recent activity</CardTitle></CardHeader><CardContent className="space-y-3">{dashboard.recentActivity.map((item) => <div key={item.id} className="text-sm"><span className="font-medium">{item.user.name}</span> <span className="text-muted-foreground">{item.message}</span></div>)}</CardContent></Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
