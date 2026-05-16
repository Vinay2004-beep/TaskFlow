import { Router } from "express";
import { createTaskController, deleteTaskController, listTasksController, updateTaskController, updateTaskStatusController } from "../controllers/task.controller.js";
import { authenticate, requireAdmin, requireMember } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { statusSchema, taskSchema, taskUpdateSchema } from "../utils/validators.js";

export const taskRouter = Router({ mergeParams: true });

taskRouter.use(authenticate);
taskRouter.get("/", requireMember, asyncHandler(listTasksController));
taskRouter.post("/", requireAdmin, validate(taskSchema), asyncHandler(createTaskController));
taskRouter.patch("/:taskId", requireAdmin, validate(taskUpdateSchema), asyncHandler(updateTaskController));
taskRouter.patch("/:taskId/status", requireMember, validate(statusSchema), asyncHandler(updateTaskStatusController));
taskRouter.delete("/:taskId", requireAdmin, asyncHandler(deleteTaskController));
