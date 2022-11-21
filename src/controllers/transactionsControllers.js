import { ObjectId } from "mongodb";
import { transactionsCollection } from "../database/db.js";

export async function addTransaction(req, res) {
  const user = res.locals.user;
  const transaction = res.locals.transaction;
  console.log(transaction);
  try {
    await transactionsCollection.insertOne({
      userId: user?._id,
      ...transaction,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getTransactions(req, res) {
  const user = res.locals.user;

  try {
    const transactionsUser = await transactionsCollection
      .find({ userId: user?._id })
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
      userId: user._id,
      balance,
      transactions: transactionsUser,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteTransactions(req, res) {
  const transactionId = res.locals.transactionId;

  try {
    await transactionsCollection.deleteOne({
      _id: new ObjectId(transactionId),
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
