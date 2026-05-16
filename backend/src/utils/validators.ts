import { Priority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8)
});

export const projectSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(5).max(1000)
});

export const memberEmailSchema = z.object({
  email: z.string().email().toLowerCase()
});

export const taskSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().min(1).max(2000),
  dueDate: z.string().datetime(),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  assigneeId: z.string().optional().nullable()
});

export const taskUpdateSchema = taskSchema.partial();

export const statusSchema = z.object({
  status: z.nativeEnum(TaskStatus)
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  bio: z.string().max(240).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable()
});
