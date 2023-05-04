import { usersCollection } from "../database/db.js";

async function findByEmail(email) {
  return await usersCollection.findOne({ email });
}

async function registerUser(userToRegister) {
  const { username, email, passwordHash } = userToRegister;

  await usersCollection.insertOne({
    username,
    email,
    password: passwordHash,
    createAt: new Date().toISOString(),
  });
}

export const authRepository = {
  registerUser,
  findByEmail,
};
