import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { login, logout, refresh, signup } from "../services/auth.service.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.js";

export async function signupController(req: Request, res: Response) {
  const result = await signup(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json(result);
}

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json(result);
}

export async function refreshController(req: Request, res: Response) {
  const token = req.cookies?.refreshToken ?? req.body.refreshToken;
  const result = await refresh(token);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json(result);
}

export async function logoutController(req: Request, res: Response) {
  await logout(req.cookies?.refreshToken ?? req.body.refreshToken);
  clearAuthCookies(res);
  res.json({ ok: true });
}

export async function meController(req: Request, res: Response) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, avatarUrl: true, bio: true, createdAt: true }
  });
  res.json(user);
}
