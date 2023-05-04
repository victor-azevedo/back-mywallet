import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ConflictError, NotFoundError } from "../errors/index.js";
import { authRepository } from "../repositories/auth-repository.js";
import { sessionService } from "./session-service.js";

async function registerUser(userToRegister) {
  const { username, email, password } = userToRegister;

  const userWithSameEmail = await authRepository.findByEmail(email);
  if (userWithSameEmail) throw new ConflictError();

  const passwordHash = bcrypt.hashSync(password, 10);

  await authRepository.registerUser({ username, email, passwordHash });
}

async function login(userToLogin) {
  const { email, password } = userToLogin;

  const userFind = await authRepository.findByEmail(email);
  if (!userFind) throw new NotFoundError();

  if (!bcrypt.compareSync(password, userFind.password))
    throw new ConflictError();

  const token = jwt.sign(
    {
      userId: userFind._id,
      username: userFind.username,
      email: userFind.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  await sessionService.create({ userId: userFind._id, token });

  return token;
}

export const authService = {
  registerUser,
  login,
};
