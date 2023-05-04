import { authService } from "../services/auth-service.js";

async function registerUser(req, res) {
  const userToRegister = req.body;

  try {
    await authService.registerUser(userToRegister);
    return res.sendStatus(201);
  } catch (error) {
    handleRequestError(res, error);
  }
}

async function login(req, res) {
  const userToLogin = req.body;

  try {
    const token = await authService.login(userToLogin);
    return res.status(201).send({ token });
  } catch (error) {
    handleRequestError(res, error);
  }
}

export const authController = {
  registerUser,
  login,
};
