import { authService } from "../services/auth-service.js";

async function registerUser(req, res) {
  const userToRegister = req.body;

  try {
    await authService.registerUser(userToRegister);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(error.status || 500);
  }
}

async function login(req, res) {
  const userToLogin = req.body;

  try {
    const token = await authService.login(userToLogin);
    return res.status(201).send({ token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(error.status || 500);
  }
}

export const authController = {
  registerUser,
  login,
};
