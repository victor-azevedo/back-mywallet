import { Router } from "express";
import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionsControllers.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.use(authValidation);

router.post("/transactions", addTransaction);
router.get("/transactions", getTransactions);

export default router;
