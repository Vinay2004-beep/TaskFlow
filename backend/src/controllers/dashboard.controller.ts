import type { Request, Response } from "express";
import { Role } from "@prisma/client";
import { getDashboard } from "../services/dashboard.service.js";

export async function dashboardController(req: Request, res: Response) {
  res.json(await getDashboard(req.params.projectId, req.user!.id, req.projectRole ?? Role.MEMBER));
}
