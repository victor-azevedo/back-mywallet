import { handleRequestError } from "../errors/index.js";
import { sessionService } from "../services/session-service.js";

async function logout(req, res) {
  /*
    #swagger.tags = ['Users']
  */

  const token = res.locals.token;

  try {
    await sessionService.deleteSession(token);
    return res.sendStatus(200);
  } catch (error) {
    handleRequestError(res, error);
  }
}

export const sessionController = {
  logout,
};
