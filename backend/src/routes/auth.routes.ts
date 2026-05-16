import { Router } from "express";
import { loginController, logoutController, meController, refreshController, signupController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { loginSchema, signupSchema } from "../utils/validators.js";

export const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), asyncHandler(signupController));
authRouter.post("/login", validate(loginSchema), asyncHandler(loginController));
authRouter.post("/refresh", asyncHandler(refreshController));
authRouter.post("/logout", asyncHandler(logoutController));
authRouter.get("/me", authenticate, asyncHandler(meController));
