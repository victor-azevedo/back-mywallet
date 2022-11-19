import { usersCollection, sessionsCollection } from "../database/db.js";
import { registerSchema, loginSchema } from "../index.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function registerUser(req, res) {
  const { username, email, password, repeatPassword } = req.body;

  const newUser = { username, email, password, repeatPassword };
  const { error } = registerSchema.validate(newUser, { abortEarly: false });
  if (error) {
    console.log(error.details.map((detail) => detail.message));
    res.sendStatus(422);
    return;
  }

  try {
    const newUserFind = await usersCollection.findOne({ email });
    if (newUserFind) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    await usersCollection.insertOne({
      username,
      email,
      password: passwordHash,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  res.sendStatus(201);
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = { email, password };
  const { error } = loginSchema.validate(user, { abortEarly: false });
  if (error) {
    console.log(error.details.map((detail) => detail.message));
    res.sendStatus(422);
    return;
  }

  try {
    const userFind = await usersCollection.findOne({ email });

    if (userFind && bcrypt.compareSync(password, userFind.password)) {
      delete userFind.password;

      const isUserLogged = await sessionsCollection.findOne({
        userId: userFind._id,
      });
      let token = "";
      if (isUserLogged) {
        token = isUserLogged.token;
      } else {
        token = uuid();
        await sessionsCollection.insertOne({
          token,
          userId: userFind._id,
        });
      }

      return res.send({
        id: userFind._id,
        username: userFind.username,
        email: userFind.email,
        token,
      });
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function logout(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await sessionsCollection.findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    await sessionsCollection.deleteOne({ token });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
