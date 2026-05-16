import type { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/tokens.js";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.accessToken;

  if (!token) throw new ApiError(401, "Authentication required");

  const payload = verifyAccessToken(token);
  req.user = {
    id: payload.sub,
    email: payload.email,
    name: payload.name
  };
  next();
}

export function requireProjectRole(roles: Role[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const projectId = req.params.projectId ?? req.body.projectId;
    if (!projectId) throw new ApiError(400, "Project id is required");

    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } }
    });

    if (!membership) throw new ApiError(403, "You do not belong to this project");
    req.projectRole = membership.role;

    if (!roles.includes(membership.role)) {
      throw new ApiError(403, "You do not have permission for this action");
    }

    next();
  };
}

export const requireAdmin = requireProjectRole([Role.ADMIN]);
export const requireMember = requireProjectRole([Role.ADMIN, Role.MEMBER]);
