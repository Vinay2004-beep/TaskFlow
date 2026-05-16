import { ActivityAction, Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { logActivity } from "./activity.service.js";
import { sendInvitationEmail } from "./email.service.js";
import { createNotification } from "./notification.service.js";

const projectInclude = {
  members: {
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } }
    },
    orderBy: { createdAt: "asc" as const }
  },
  _count: { select: { tasks: true } }
};

export async function listUserProjects(userId: string) {
  return prisma.project.findMany({
    where: { members: { some: { userId } } },
    include: projectInclude,
    orderBy: { updatedAt: "desc" }
  });
}

export async function getProject(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, members: { some: { userId } } },
    include: projectInclude
  });
  if (!project) throw new ApiError(404, "Project not found");
  return project;
}

export async function createProject(input: { name: string; description: string; userId: string }) {
  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      members: { create: { userId: input.userId, role: Role.ADMIN } }
    },
    include: projectInclude
  });

  await logActivity({
    action: ActivityAction.PROJECT_CREATED,
    message: `created project ${project.name}`,
    userId: input.userId,
    projectId: project.id
  });

  return project;
}

export async function addMember(projectId: string, email: string, inviterId: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "No user found with that email");

  const project = await prisma.project.findUniqueOrThrow({ where: { id: projectId } });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: user.id, projectId } },
    update: {},
    create: { userId: user.id, projectId, role: Role.MEMBER }
  });

  const inviter = await prisma.user.findUniqueOrThrow({ where: { id: inviterId } });
  await sendInvitationEmail(user.email, project.name, inviter.name);
  await createNotification({
    userId: user.id,
    projectId,
    title: "Added to project",
    body: `${inviter.name} added you to ${project.name}`
  });
  await logActivity({
    action: ActivityAction.MEMBER_ADDED,
    message: `added ${user.name} to the project`,
    userId: inviterId,
    projectId
  });

  return getProject(projectId, inviterId);
}

export async function removeMember(projectId: string, memberId: string, actorId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: memberId, projectId } }
  });
  if (!membership) throw new ApiError(404, "Member not found");
  if (membership.role === Role.ADMIN) throw new ApiError(400, "Project admin cannot be removed");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: memberId } });
  await prisma.projectMember.delete({ where: { id: membership.id } });
  await logActivity({
    action: ActivityAction.MEMBER_REMOVED,
    message: `removed ${user.name} from the project`,
    userId: actorId,
    projectId
  });

  return { ok: true };
}
