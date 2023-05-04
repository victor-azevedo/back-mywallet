import { NotFoundError } from "../errors/index.js";
import { transactionsRepository } from "../repositories/transaction-repository.js";

async function create({ userId, transactionData }) {
  return await transactionsRepository.create({ userId, transactionData });
}

async function getByUserId(userId) {
  const userTransactions = await transactionsRepository.getByUserId(userId);
  const [userBalance] = await transactionsRepository.getUserBalance(userId);

  return {
    userId,
    balance: userBalance?.balance ?? 0,
    transactions: userTransactions,
  };
}

async function deleteUserTransaction({ id, userId }) {
  const { deletedCount } = await transactionsRepository.deleteUserTransaction({
    id,
    userId,
  });
  if (deletedCount === 0) throw new NotFoundError();
}

async function updateUserTransaction({ id, userId, transactionData }) {
  const { modifiedCount } = await transactionsRepository.updateUserTransaction({
    id,
    userId,
    transactionData,
  });
  if (modifiedCount === 0) throw new NotFoundError();
}

export const transactionsService = {
  create,
  getByUserId,
  deleteUserTransaction,
  updateUserTransaction,
};
