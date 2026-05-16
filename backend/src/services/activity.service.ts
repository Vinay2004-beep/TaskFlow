import type { ActivityAction, TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { io } from "../socket/io.js";

export async function logActivity(input: {
  action: ActivityAction;
  message: string;
  userId: string;
  projectId: string;
  taskId?: string;
}) {
  const activity = await prisma.activityLog.create({
    data: input,
    include: { user: { select: { id: true, name: true, avatarUrl: true } }, task: true }
  });
  io.to(input.projectId).emit("activity:new", activity);
  return activity;
}

export function taskStatusLabel(status: TaskStatus) {
  return status === "TODO" ? "To Do" : status === "IN_PROGRESS" ? "In Progress" : "Done";
}
