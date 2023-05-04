import { sessionsCollection } from "../database/db.js";

async function create({ userId, token }) {
  return await sessionsCollection.insertOne({
    userId,
    token,
    createAt: new Date().toISOString(),
  });
}

async function deleteSession(token) {
  return await sessionsCollection.deleteOne({ token });
}

export const sessionRepository = {
  create,
  deleteSession,
};
