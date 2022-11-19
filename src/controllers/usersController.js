import { usersCollection, sessionsCollection } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function registerUser(req, res) {
  const { username, email, password } = res.locals.newUser;

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
  const { email, password } = res.locals.user;

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
  const user = res.locals.user;
  try {
    await sessionsCollection.deleteOne({ userId: user?._id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
