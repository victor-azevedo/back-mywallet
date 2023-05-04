import { sessionRepository } from "../repositories/session-repository.js";

async function create({ userId, token }) {
  return await sessionRepository.create({ userId, token });
}

async function deleteSession(token) {
  return await sessionRepository.deleteSession(token);
}

export const sessionService = {
  create,
  deleteSession,
};
