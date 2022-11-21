import { Router } from "express";
import { registerUser, login, logout } from "../controllers/usersController.js";
import { authValidation } from "../middleware/authValidationMiddleware.js";
import { loginSchemaValidationMiddleware } from "../middleware/loginSchemaValidationMiddleware.js";
import { registerSchemaValidationMiddleware } from "../middleware/registerSchemaValidationMiddleware.js";

const router = Router();

router.post("/sign-up", registerSchemaValidationMiddleware, registerUser);
router.post("/sign-in", loginSchemaValidationMiddleware, login);
router.delete("/logout", authValidation, logout);

export default router;
