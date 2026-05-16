import { Router } from "express";
import { markNotificationsReadController, notificationsController, updateProfileController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { profileSchema } from "../utils/validators.js";

export const userRouter = Router();

userRouter.use(authenticate);
userRouter.patch("/profile", validate(profileSchema), asyncHandler(updateProfileController));
userRouter.get("/notifications", asyncHandler(notificationsController));
userRouter.patch("/notifications/read", asyncHandler(markNotificationsReadController));
