import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export async function updateProfileController(req: Request, res: Response) {
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: req.body,
    select: { id: true, name: true, email: true, avatarUrl: true, bio: true, createdAt: true }
  });
  res.json(user);
}

export async function notificationsController(req: Request, res: Response) {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 30
  });
  res.json(notifications);
}

export async function markNotificationsReadController(req: Request, res: Response) {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, read: false },
    data: { read: true }
  });
  res.json({ ok: true });
}
