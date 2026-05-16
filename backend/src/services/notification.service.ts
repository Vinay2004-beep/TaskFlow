import { prisma } from "../config/prisma.js";
import { io } from "../socket/io.js";

export async function createNotification(input: {
  userId: string;
  projectId?: string;
  title: string;
  body: string;
}) {
  const notification = await prisma.notification.create({ data: input });
  io.to(`user:${input.userId}`).emit("notification:new", notification);
  return notification;
}

export async function notifyProjectMembers(projectId: string, title: string, body: string, excludeUserId?: string) {
  const members = await prisma.projectMember.findMany({ where: { projectId } });
  await Promise.all(
    members
      .filter((member) => member.userId !== excludeUserId)
      .map((member) => createNotification({ userId: member.userId, projectId, title, body }))
  );
}
