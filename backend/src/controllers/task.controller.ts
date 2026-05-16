import type { Request, Response } from "express";
import { Role } from "@prisma/client";
import { createTask, deleteTask, listTasks, updateAssignedStatus, updateTask } from "../services/task.service.js";

export async function listTasksController(req: Request, res: Response) {
  res.json(await listTasks(req.params.projectId, req.user!.id, req.projectRole ?? Role.MEMBER, req.query));
}

export async function createTaskController(req: Request, res: Response) {
  res.status(201).json(await createTask(req.params.projectId, req.user!.id, req.body));
}

export async function updateTaskController(req: Request, res: Response) {
  res.json(await updateTask(req.params.projectId, req.params.taskId, req.user!.id, req.body));
}

export async function updateTaskStatusController(req: Request, res: Response) {
  if (req.projectRole === Role.ADMIN) {
    return res.json(await updateTask(req.params.projectId, req.params.taskId, req.user!.id, { status: req.body.status }));
  }
  res.json(await updateAssignedStatus(req.params.projectId, req.params.taskId, req.user!.id, req.body.status));
}

export async function deleteTaskController(req: Request, res: Response) {
  res.json(await deleteTask(req.params.projectId, req.params.taskId, req.user!.id));
}
