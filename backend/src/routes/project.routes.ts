import { Router } from "express";
import { addMemberController, createProjectController, getProjectController, listProjectsController, removeMemberController } from "../controllers/project.controller.js";
import { authenticate, requireAdmin, requireMember } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { memberEmailSchema, projectSchema } from "../utils/validators.js";

export const projectRouter = Router();

projectRouter.use(authenticate);
projectRouter.get("/", asyncHandler(listProjectsController));
projectRouter.post("/", validate(projectSchema), asyncHandler(createProjectController));
projectRouter.get("/:projectId", requireMember, asyncHandler(getProjectController));
projectRouter.post("/:projectId/members", requireAdmin, validate(memberEmailSchema), asyncHandler(addMemberController));
projectRouter.delete("/:projectId/members/:memberId", requireAdmin, asyncHandler(removeMemberController));
