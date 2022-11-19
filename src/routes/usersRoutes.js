import { Router } from "express";
import { registerUser, login, logout } from "../controllers/usersController.js";

const router = Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", login);
router.delete("/logout", logout);

export default router;
