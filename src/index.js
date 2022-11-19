import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import {
  usersCollection,
  transactionsCollection,
  sessionsCollection,
} from "./database/db.js";
import { registerUser, login, logout } from "./controllers/usersController.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(12),
  repeatPassword: Joi.ref("password"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(12),
});

const transactionTypes = ["incoming", "outgoing"];
export const transactionSchema = Joi.object({
  value: Joi.number().required(),
  description: Joi.string().min(4).max(30).required(),
  type: Joi.alternatives().try(...transactionTypes),
  date: Joi.date().iso().required(),
});

app.post("/sign-up", registerUser);

app.post("/sign-in", login);

app.delete("/logout", logout);

app.post("/transactions", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const { value, description, type, date } = req.body;

  if (!token) return res.sendStatus(401);

  const transaction = {
    value: Number(value).toFixed(2),
    description,
    type,
    date,
  };
  const { error } = transactionSchema.validate(transaction, {
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

    await transactionsCollection.insertOne({
      userId: session.userId,
      ...transaction,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/transactions", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await sessionsCollection.findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const transactionsUser = await transactionsCollection
      .find({ userId: session.userId })
      .toArray();

    const values = transactionsUser.map((transaction) => {
      if (transaction.type === "incoming") {
        return Number(transaction.value);
      } else if (transaction.type === "outgoing") {
        return Number(-transaction.value);
      }
    });

    const balance = values.reduce((acc, value) => acc + value, 0).toFixed(2);
    transactionsUser.forEach((transaction) => delete transaction.userId);

    res.status(200).send({
      userId: session.userId,
      balance,
      transactions: transactionsUser,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(process.env.API_PORT, () => {
  console.log(`Server listening on PORT ${process.env.PORT}`);
});
