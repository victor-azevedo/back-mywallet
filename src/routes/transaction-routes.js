import { Router } from "express";

import { transactionsController } from "../controllers/transaction-controller.js";
import { authValidation } from "../middleware/authValidation-middleware.js";
import {
  validateBody,
  validateParams,
} from "../middleware/validateSchema-middleware.js";
import {
  transactionCreateSchema,
  transactionParamsSchema,
  transactionUpdateSchema,
} from "../models/transactions-schema.js";

const transactionsRouter = Router();

transactionsRouter
  .use(authValidation)
  .post(
    "/",
    validateBody(transactionCreateSchema),
    transactionsController.addUserTransaction
  )
  .get("/", transactionsController.getAllUserTransactions)
  .delete(
    "/:id",
    validateParams(transactionParamsSchema),
    transactionsController.deleteUserTransaction
  )
  .patch(
    "/:id",
    validateParams(transactionParamsSchema),
    validateBody(transactionUpdateSchema),
    transactionsController.updateUserTransaction
  );

export default transactionsRouter;
