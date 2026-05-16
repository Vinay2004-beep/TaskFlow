import { ActivityAction, Role, TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { io } from "../socket/io.js";
import { ApiError } from "../utils/api-error.js";
import { logActivity, taskStatusLabel } from "./activity.service.js";
import { createNotification, notifyProjectMembers } from "./notification.service.js";

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
  creator: { select: { id: true, name: true, email: true, avatarUrl: true } }
};

export async function listTasks(projectId: string, userId: string, role: Role, query: Record<string, unknown>) {
  const search = typeof query.search === "string" ? query.search : undefined;
  const status = typeof query.status === "string" && query.status in TaskStatus ? (query.status as TaskStatus) : undefined;
  const mineOnly = role === Role.MEMBER;

  return prisma.task.findMany({
    where: {
      projectId,
      ...(mineOnly ? { assigneeId: userId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    },
    include: taskInclude,
    orderBy: query.sort === "dueDate" ? { dueDate: "asc" } : { updatedAt: "desc" }
  });
}

export async function createTask(projectId: string, creatorId: string, data: {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: TaskStatus;
  assigneeId?: string | null;
}) {
  if (data.assigneeId) await ensureProjectMember(projectId, data.assigneeId);

  const task = await prisma.task.create({
    data: {
      ...data,
      dueDate: new Date(data.dueDate),
      creatorId,
      projectId
    },
    include: taskInclude
  });

  await logActivity({
    action: ActivityAction.TASK_CREATED,
    message: `created task ${task.title}`,
    userId: creatorId,
    projectId,
    taskId: task.id
  });
  if (task.assigneeId) {
    await createNotification({
      userId: task.assigneeId,
      projectId,
      title: "New task assigned",
      body: `${task.title} was assigned to you`
    });
  }
  io.to(projectId).emit("task:created", task);
  return task;
}

export async function updateTask(projectId: string, taskId: string, actorId: string, data: Partial<{
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: TaskStatus;
  assigneeId: string | null;
}>) {
  const existing = await prisma.task.findFirst({ where: { id: taskId, projectId } });
  if (!existing) throw new ApiError(404, "Task not found");
  if (data.assigneeId) await ensureProjectMember(projectId, data.assigneeId);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    },
    include: taskInclude
  });

  await logActivity({
    action: ActivityAction.TASK_UPDATED,
    message: `updated task ${task.title}`,
    userId: actorId,
    projectId,
    taskId
  });
  if (data.assigneeId && data.assigneeId !== existing.assigneeId) {
    await createNotification({
      userId: data.assigneeId,
      projectId,
      title: "Task assigned",
      body: `${task.title} was assigned to you`
    });
  }
  io.to(projectId).emit("task:updated", task);
  return task;
}

export async function updateAssignedStatus(projectId: string, taskId: string, actorId: string, status: TaskStatus) {
  const task = await prisma.task.findFirst({ where: { id: taskId, projectId } });
  if (!task) throw new ApiError(404, "Task not found");
  if (task.assigneeId !== actorId) throw new ApiError(403, "Members can update only assigned tasks");

  const updated = await prisma.task.update({ where: { id: taskId }, data: { status }, include: taskInclude });
  await logActivity({
    action: ActivityAction.STATUS_CHANGED,
    message: `moved ${updated.title} to ${taskStatusLabel(status)}`,
    userId: actorId,
    projectId,
    taskId
  });
  io.to(projectId).emit("task:updated", updated);
  return updated;
}

export async function deleteTask(projectId: string, taskId: string, actorId: string) {
  const task = await prisma.task.findFirst({ where: { id: taskId, projectId } });
  if (!task) throw new ApiError(404, "Task not found");

  await prisma.task.delete({ where: { id: taskId } });
  await logActivity({
    action: ActivityAction.TASK_DELETED,
    message: `deleted task ${task.title}`,
    userId: actorId,
    projectId
  });
  await notifyProjectMembers(projectId, "Task deleted", `${task.title} was deleted`, actorId);
  io.to(projectId).emit("task:deleted", { id: taskId });
  return { ok: true };
}

async function ensureProjectMember(projectId: string, userId: string) {
  const member = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId, projectId } } });
  if (!member) throw new ApiError(400, "Assignee must be a project member");
}
