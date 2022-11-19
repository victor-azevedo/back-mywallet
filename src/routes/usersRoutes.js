import { Router } from "express";
import { registerUser, login, logout } from "../controllers/usersController.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", login);
router.delete("/logout", authValidation, logout);

export default router;
