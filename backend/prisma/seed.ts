import { ActivityAction, PrismaClient, Priority, Role, TaskStatus } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
  try {
  await prisma.refreshToken.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
} catch (error) {
  console.log("Cleanup skipped");
}

  const password = await hashPassword("Password123!");
  const [admin, maya, leo] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Avery Admin",
        email: "admin@example.com",
        password,
        bio: "Operations lead keeping launch work on track.",
        avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Avery"
      }
    }),
    prisma.user.create({
      data: {
        name: "Maya Member",
        email: "maya@example.com",
        password,
        bio: "Product designer and research partner.",
        avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Maya"
      }
    }),
    prisma.user.create({
      data: {
        name: "Leo Member",
        email: "leo@example.com",
        password,
        bio: "Frontend engineer focused on dashboard polish.",
        avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Leo"
      }
    })
  ]);

  const project = await prisma.project.create({
    data: {
      name: "SaaS Launch Workspace",
      description: "A demo project for launch planning, analytics, and team delivery.",
      members: {
        create: [
          { userId: admin.id, role: Role.ADMIN },
          { userId: maya.id, role: Role.MEMBER },
          { userId: leo.id, role: Role.MEMBER }
        ]
      }
    }
  });

  const now = Date.now();
  const tasks = await prisma.task.createManyAndReturn({
    data: [
      {
        title: "Design onboarding states",
        description: "Create empty, loading, and success states for first-run project setup.",
        dueDate: new Date(now + 1000 * 60 * 60 * 24 * 2),
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        projectId: project.id,
        creatorId: admin.id,
        assigneeId: maya.id
      },
      {
        title: "Wire dashboard charts",
        description: "Connect analytics cards and Recharts graphs to the dashboard endpoint.",
        dueDate: new Date(now + 1000 * 60 * 60 * 24 * 4),
        priority: Priority.MEDIUM,
        status: TaskStatus.TODO,
        projectId: project.id,
        creatorId: admin.id,
        assigneeId: leo.id
      },
      {
        title: "Review Railway deployment",
        description: "Validate environment variables, build commands, and migration command.",
        dueDate: new Date(now - 1000 * 60 * 60 * 24),
        priority: Priority.HIGH,
        status: TaskStatus.TODO,
        projectId: project.id,
        creatorId: admin.id,
        assigneeId: admin.id
      },
      {
        title: "Publish invite email copy",
        description: "Finalize email copy for team invitations.",
        dueDate: new Date(now + 1000 * 60 * 60 * 24),
        priority: Priority.LOW,
        status: TaskStatus.DONE,
        projectId: project.id,
        creatorId: admin.id,
        assigneeId: maya.id
      }
    ]
  });

  await prisma.activityLog.createMany({
    data: [
      {
        action: ActivityAction.PROJECT_CREATED,
        message: `created project ${project.name}`,
        userId: admin.id,
        projectId: project.id
      },
      ...tasks.map((task) => ({
        action: ActivityAction.TASK_CREATED,
        message: `created task ${task.title}`,
        userId: admin.id,
        projectId: project.id,
        taskId: task.id
      }))
    ]
  });

  await prisma.notification.createMany({
    data: [
      { userId: maya.id, projectId: project.id, title: "Welcome", body: "You were added to SaaS Launch Workspace." },
      { userId: leo.id, projectId: project.id, title: "New task", body: "Wire dashboard charts was assigned to you." }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete. Login with admin@example.com / Password123!");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
