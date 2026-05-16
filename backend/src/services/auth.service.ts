import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function issueTokens(user: { id: string; email: string; name: string }) {
  const payload = { sub: user.id, email: user.email, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash: sha256(refreshToken),
      userId: user.id,
      expiresAt
    }
  });

  return { accessToken, refreshToken };
}

export async function signup(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ApiError(409, "Email is already registered");

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: await hashPassword(input.password)
    },
    select: { id: true, name: true, email: true, avatarUrl: true, bio: true, createdAt: true }
  });

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt
  };

  const tokens = await issueTokens(user);
  return { user: safeUser, ...tokens };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const stored = await prisma.refreshToken.findFirst({
    where: {
      tokenHash: sha256(refreshToken),
      userId: payload.sub,
      revokedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!stored) throw new ApiError(401, "Invalid refresh token");

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() }
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true }
  });

  return issueTokens(user);
}

export async function logout(refreshToken?: string) {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: sha256(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() }
  });
}
