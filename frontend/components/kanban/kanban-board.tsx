"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/forms/task-form";
import { formatDate, isOverdue } from "@/lib/utils";
import { api } from "@/services/api";
import type { ProjectMember, Role, Task, TaskStatus } from "@/types";

const columns: { id: TaskStatus; label: string }[] = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" }
];

export function KanbanBoard({ projectId, role, members, tasks, setTasks }: { projectId: string; role: Role; members: ProjectMember[]; tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>> }) {
  const [editing, setEditing] = useState<Task | null>(null);
  const grouped = useMemo(() => Object.fromEntries(columns.map((col) => [col.id, tasks.filter((task) => task.status === col.id)])) as Record<TaskStatus, Task[]>, [tasks]);

  async function moveTask(taskId: string, status: TaskStatus) {
    const previous = tasks;
    setTasks((items) => items.map((task) => task.id === taskId ? { ...task, status } : task));
    try {
      const { data } = await api.patch<Task>(`/projects/${projectId}/tasks/${taskId}/status`, { status });
      setTasks((items) => items.map((task) => task.id === taskId ? data : task));
    } catch {
      setTasks(previous);
    }
  }

  async function updateTask(values: any) {
    if (!editing) return;
    const { data } = await api.patch<Task>(`/projects/${projectId}/tasks/${editing.id}`, values);
    setTasks((items) => items.map((task) => task.id === editing.id ? data : task));
    setEditing(null);
  }

  async function removeTask(task: Task) {
    await api.delete(`/projects/${projectId}/tasks/${task.id}`);
    setTasks((items) => items.filter((item) => item.id !== task.id));
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <section
            key={column.id}
            className="min-h-[32rem] rounded-lg bg-muted/60 p-3"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const taskId = event.dataTransfer.getData("taskId");
              if (taskId) void moveTask(taskId, column.id);
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">{column.label}</h2>
              <Badge>{grouped[column.id].length}</Badge>
            </div>
            <div className="space-y-3">
              {grouped[column.id].map((task, index) => (
                <motion.div
                 key={`${task.id}-${column.id}-${index}`}
                 layout
                 draggable onDragStart={(event: any) => event.dataTransfer.setData("taskId", task.id)}>
                  <Card className="group p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/30 bg-slate-900/70 border border-slate-800">                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      {role === "ADMIN" ? (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditing(task)} aria-label="Edit task"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => void removeTask(task)} aria-label="Delete task"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <Badge className={task.priority === "HIGH" ? "border-destructive text-destructive" : task.priority === "MEDIUM" ? "border-orange-400 text-orange-600" : ""}>{task.priority}</Badge>
                      <span className={isOverdue(task.dueDate, task.status) ? "text-destructive" : "text-muted-foreground"}>{formatDate(task.dueDate)}</span>
                      <span className="ml-auto text-muted-foreground">{task.assignee?.name ?? "Unassigned"}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit task</DialogTitle></DialogHeader>{editing ? <TaskForm members={members} task={editing} onSubmit={updateTask} /> : null}</DialogContent>
      </Dialog>
    </>
  );
}
