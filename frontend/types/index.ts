export type Role = "ADMIN" | "MEMBER";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
};

export type ProjectMember = {
  id: string;
  role: Role;
  user: User;
  userId: string;
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number };
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  projectId: string;
  assigneeId?: string | null;
  creatorId: string;
  assignee?: User | null;
  creator?: User;
  createdAt: string;
  updatedAt: string;
};

export type Dashboard = {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  byStatus: { status: TaskStatus; count: number }[];
  byUser: { name: string; count: number }[];
  recentActivity: { id: string; message: string; createdAt: string; user: User }[];
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};
