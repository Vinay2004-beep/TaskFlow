import { Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export async function getDashboard(projectId: string, userId: string, role: Role) {
  const baseWhere = {
    projectId,
    ...(role === Role.MEMBER ? { assigneeId: userId } : {})
  };

  const [tasks, activities] = await Promise.all([
    prisma.task.findMany({
      where: baseWhere,
      include: { assignee: { select: { id: true, name: true, avatarUrl: true } } }
    }),
    prisma.activityLog.findMany({
      where: { projectId },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  const byStatus = ["TODO", "IN_PROGRESS", "DONE"].map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length
  }));
  const byUser = Object.values(
    tasks.reduce<Record<string, { name: string; count: number }>>((acc, task) => {
      const name = task.assignee?.name ?? "Unassigned";
      acc[name] = acc[name] ?? { name, count: 0 };
      acc[name].count += 1;
      return acc;
    }, {})
  );
  const overdue = tasks.filter((task) => task.status !== "DONE" && task.dueDate < new Date()).length;

  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((task) => task.status === "DONE").length,
    overdueTasks: overdue,
    byStatus,
    byUser,
    recentActivity: activities
  };
}
