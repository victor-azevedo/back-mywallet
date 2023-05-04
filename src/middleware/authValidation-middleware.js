import jwt from "jsonwebtoken";

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

    const userToken = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) throw new UnauthorizedError();
        return decoded;
      }
    );

    const session = await sessionsCollection.findOne({ token });
    if (!session) throw new ConflictError("User not logged in");

    const userDB = await usersCollection.findOne({ _id: session.userId });
    if (!userDB) throw new NotFoundError("User not found");

    if (userToken.userId !== userDB._id.toString()) throw new ConflictError();

    res.locals.user = userToken;
    res.locals.token = token;
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal server error");
  }

  next();
}
