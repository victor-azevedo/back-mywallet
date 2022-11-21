import { sessionsCollection, usersCollection } from "../database/db.js";

export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "Authorization inexistente" });
  }

  try {
    const session = await sessionsCollection.findOne({ token });
    const user = await usersCollection.findOne({ _id: session?.userId });
    delete user?.password;

    if (!user) {
      return res
        .status(401)
        .send({ message: "Usuário não logado ou inexiste" });
    }

    res.locals.user = user;
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  next();
}
