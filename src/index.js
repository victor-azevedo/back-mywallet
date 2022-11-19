import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import { registerUser, login, logout } from "./controllers/usersController.js";
import {
  addTransaction,
  getTransactions,
} from "./controllers/transactionsControllers.js";
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

app.post("/transactions", addTransaction);

app.get("/transactions", getTransactions);

app.listen(process.env.API_PORT, () => {
  console.log(`Server listening on PORT ${process.env.PORT}`);
});
