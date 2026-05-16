import express from "express";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { taskRouter } from "./routes/task.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { errorMiddleware, notFound } from "./middleware/error.middleware.js";
import { applySecurity } from "./middleware/security.middleware.js";

export const app = express();

applySecurity(app);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "team-task-manager-api" }));
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/projects/:projectId/tasks", taskRouter);
app.use("/api/projects/:projectId/dashboard", dashboardRouter);
app.use("/api/users", userRouter);
app.use(notFound);
app.use(errorMiddleware);
