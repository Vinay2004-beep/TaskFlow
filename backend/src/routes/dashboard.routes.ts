import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authenticate, requireMember } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const dashboardRouter = Router({ mergeParams: true });

dashboardRouter.use(authenticate);
dashboardRouter.get("/", requireMember, asyncHandler(dashboardController));
