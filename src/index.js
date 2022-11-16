import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(12),
  repeatPassword: Joi.ref("password"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(12),
});

const movementTypes = ["revenue", "expense"];
const movementSchema = Joi.object({
  value: Joi.number().required(),
  description: Joi.string().min(4).max(30).required(),
  type: Joi.alternatives().try(...movementTypes),
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient
  .connect()
  .then(() => {
    console.log("Connected successfully to data server");
  })
  .catch(() => {
    console.error("ERROR: Not connected to data server");
  });

const db = mongoClient.db("myWallet");
const usersCollection = db.collection("users");
const movementsCollection = db.collection("movements");
const sessionsCollection = db.collection("sessions");

app.post("/sign-up", async (req, res) => {
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
});

app.post("/sign-in", async (req, res) => {
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
      if (isUserLogged) {
        return res.send({ ...userFind, token: isUserLogged.token });
      }

      const token = uuid();
      await sessionsCollection.insertOne({
        token,
        userId: userFind._id,
      });
      return res.send({ ...userFind, token });
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/movements", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const { value, description, type } = req.body;

  if (!token) return res.sendStatus(401);

  const movementation = { value: Number(value).toFixed(2), description, type };
  const { error } = movementSchema.validate(movementation, {
    abortEarly: false,
  });
  if (error) {
    console.log(error.details.map((detail) => detail.message));
    res.sendStatus(422);
    return;
  }

  try {
    const session = await sessionsCollection.findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    await movementsCollection.insertOne({
      userId: session.userId,
      ...movementation,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/movements", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await sessionsCollection.findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const movementsUser = await movementsCollection
      .find({ userId: session.userId })
      .toArray();
    res.status(200).send(movementsUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/logout", async (req, res) => {
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
});

app.listen(process.env.API_PORT, () => {
  console.log(`Server listening on PORT ${process.env.PORT}`);
});
