"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Priority, ProjectMember, Task, TaskStatus } from "@/types";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(1),
  dueDate: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  assigneeId: z.string().optional()
});

type Values = z.infer<typeof schema>;

export function TaskForm({ members, task, onSubmit }: { members: ProjectMember[]; task?: Task; onSubmit: (values: Values) => Promise<void> }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: task?.priority ?? "MEDIUM",
      status: task?.status ?? "TODO",
      assigneeId: task?.assigneeId ?? undefined
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => onSubmit({ ...values, dueDate: new Date(values.dueDate).toISOString() }))}>
      <div className="space-y-2"><Label>Title</Label><Input {...register("title")} />{errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}</div>
      <div className="space-y-2"><Label>Description</Label><Textarea {...register("description")} />{errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Due date</Label><Input type="date" {...register("dueDate")} /></div>
        <div className="space-y-2"><Label>Priority</Label><Select value={watch("priority")} onValueChange={(v) => setValue("priority", v as Priority)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["LOW", "MEDIUM", "HIGH"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Status</Label><Select value={watch("status")} onValueChange={(v) => setValue("status", v as TaskStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["TODO", "IN_PROGRESS", "DONE"].map((v) => <SelectItem key={v} value={v}>{v.replace("_", " ")}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label>Assignee</Label><Select value={watch("assigneeId") ?? "none"} onValueChange={(v) => setValue("assigneeId", v === "none" ? undefined : v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Unassigned</SelectItem>{members.map((m) => <SelectItem key={m.user.id} value={m.user.id}>{m.user.name}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <Button disabled={isSubmitting}>{isSubmitting ? "Saving..." : task ? "Save task" : "Create task"}</Button>
    </form>
  );
}
