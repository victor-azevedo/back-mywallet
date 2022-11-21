import { transactionSchema } from "../models/transactionsModels.js";

export function transactionSchemaValidation(req, res, next) {
  const { value, description, type, date } = req.body;

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

  res.locals.transaction = transaction;

  next();
}
