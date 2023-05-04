import { Router } from "express";

import { authController } from "../controllers/auth-controller.js";
import { validateBody } from "../middleware/validateSchema-middleware.js";
import { loginSchema, registerSchema } from "../models/auth-schema.js";

const authRouter = Router();

authRouter
  .post("/sign-up", validateBody(registerSchema), authController.registerUser)
  .post("/sign-in", validateBody(loginSchema), authController.login);

export default authRouter;
