import type { Request, Response } from "express";
import { addMember, createProject, getProject, listUserProjects, removeMember } from "../services/project.service.js";

export async function listProjectsController(req: Request, res: Response) {
  res.json(await listUserProjects(req.user!.id));
}

export async function getProjectController(req: Request, res: Response) {
  res.json(await getProject(req.params.projectId, req.user!.id));
}

export async function createProjectController(req: Request, res: Response) {
  res.status(201).json(await createProject({ ...req.body, userId: req.user!.id }));
}

export async function addMemberController(req: Request, res: Response) {
  res.json(await addMember(req.params.projectId, req.body.email, req.user!.id));
}

export async function removeMemberController(req: Request, res: Response) {
  res.json(await removeMember(req.params.projectId, req.params.memberId, req.user!.id));
}
