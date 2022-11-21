import { Router } from "express";
import {
  addTransaction,
  deleteTransactions,
  editTransactions,
  getTransactions,
} from "../controllers/transactionsControllers.js";
import { authValidation } from "../middleware/authValidationMiddleware.js";
import { checkUserTransactionsMiddleware } from "../middleware/checkUserTransactionsMiddleware.js";
import { transactionSchemaValidation } from "../middleware/transactionsSchemaValidationMiddleware.js";

const router = Router();

router.use(authValidation);

router.post("/transactions", transactionSchemaValidation, addTransaction);
router.get("/transactions", getTransactions);
router.delete(
  "/transactions/:id",
  checkUserTransactionsMiddleware,
  deleteTransactions
);
router.put(
  "/transactions/:id",
  transactionSchemaValidation,
  checkUserTransactionsMiddleware,
  editTransactions
);

export default router;
