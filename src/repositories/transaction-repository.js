import { ObjectId } from "mongodb";
import { transactionsCollection } from "../database/db.js";

async function create({ userId, transactionData }) {
  return await transactionsCollection.insertOne({
    userId: new ObjectId(userId),
    ...transactionData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

async function getByUserId(userId) {
  return await transactionsCollection
    .find({ userId: new ObjectId(userId) })
    .project({ userId: 0, updatedAt: 0 })
    .sort({ date: -1, createdAt: -1 })
    .toArray();
}

async function getUserBalance(userId) {
  return await transactionsCollection
    .aggregate([
      {
        $match: { userId: ObjectId(userId) },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$valueAtCents" },
        },
      },
      {
        $project: {
          userId,
          type: "$_id",
          total: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: null,
          incoming: {
            $sum: {
              $cond: {
                if: { $eq: ["$type", "incoming"] },
                then: "$total",
                else: 0,
              },
            },
          },
          outgoing: {
            $sum: {
              $cond: {
                if: { $eq: ["$type", "outgoing"] },
                then: "$total",
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId,
          balance: { $subtract: ["$incoming", "$outgoing"] },
        },
      },
    ])
    .toArray();
}

async function deleteUserTransaction({ id, userId }) {
  const filter = { _id: new ObjectId(id), userId: new ObjectId(userId) };

  return await transactionsCollection.deleteOne(filter);
}

async function updateUserTransaction({ id, userId, transactionData }) {
  const filter = { _id: new ObjectId(id), userId: new ObjectId(userId) };
  const updateDocument = {
    $set: {
      ...transactionData,
      updatedAt: new Date().toISOString(),
    },
  };

  return await transactionsCollection.updateOne(filter, updateDocument);
}

export const transactionsRepository = {
  create,
  getByUserId,
  getUserBalance,
  deleteUserTransaction,
  updateUserTransaction,
};
