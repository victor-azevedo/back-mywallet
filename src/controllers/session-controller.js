import { sessionService } from "../services/session-service.js";

async function logout(req, res) {
  const token = res.locals.token;

  try {
    await sessionService.deleteSession(token);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(error.status || 500);
  }
}

export const sessionController = {
  logout,
};
