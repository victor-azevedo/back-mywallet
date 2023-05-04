import { sessionsCollection, usersCollection } from "../database/db.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";

export async function authValidation(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new UnauthorizedError();

    const token = authorization.replace("Bearer ", "");
    if (!token) throw new UnauthorizedError();

    const session = await sessionsCollection.findOne({ token });
    if (!session) throw new ConflictError("User not logged in");

    const user = await usersCollection.findOne({ _id: session.userId });
    if (!user) throw new NotFoundError("User not found");

    delete user?.password;
    res.locals.user = user;
    res.locals.token = token;
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal server error");
  }

  next();
}
