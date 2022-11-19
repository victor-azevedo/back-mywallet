import { transactionsCollection, sessionsCollection } from "../database/db.js";
import { transactionSchema } from "../models/transactionsModels.js";

export async function addTransaction(req, res) {
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
}

export async function getTransactions(req, res) {
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
}
