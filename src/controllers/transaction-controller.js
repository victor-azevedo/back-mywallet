import { handleRequestError } from "../errors/index.js";
import { transactionsService } from "../services/transaction-service.js";

export async function addUserTransaction(req, res) {
  const { userId } = res.locals.user;
  const transactionData = req.body;

  try {
    await transactionsService.create({ userId, transactionData });
    res.sendStatus(201);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export async function getAllUserTransactions(req, res) {
  const { userId } = res.locals.user;

  try {
    const transactionsUser = await transactionsService.getByUserId(userId);
    res.send(transactionsUser);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export async function deleteUserTransaction(req, res) {
  const { userId } = res.locals.user;
  const { id } = req.params;

  try {
    await transactionsService.deleteUserTransaction({ id, userId });
    res.sendStatus(200);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export async function updateUserTransaction(req, res) {
  const { userId } = res.locals.user;
  const { id } = req.params;
  const transactionData = req.body;

  try {
    await transactionsService.updateUserTransaction({
      id,
      userId,
      transactionData,
    });
    res.sendStatus(200);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export const transactionsController = {
  addUserTransaction,
  getAllUserTransactions,
  deleteUserTransaction,
  updateUserTransaction,
};
