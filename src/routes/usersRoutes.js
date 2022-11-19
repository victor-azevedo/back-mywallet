import { Router } from "express";
import { registerUser, login, logout } from "../controllers/usersController.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";
import { loginSchemaValidationMiddleware } from "../middlewares/loginSchemaValidationMiddleware.js";
import { registerSchemaValidationMiddleware } from "../middlewares/registerSchemaValidationMiddleware.js";

const router = Router();

router.post("/sign-up", registerSchemaValidationMiddleware, registerUser);
router.post("/sign-in", loginSchemaValidationMiddleware, login);
router.delete("/logout", authValidation, logout);

export default router;
