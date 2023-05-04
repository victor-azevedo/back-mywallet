import Joi from "joi";

const transactionTypes = ["incoming", "outgoing"];

export const transactionCreateSchema = Joi.object({
  valueAtCents: Joi.number().integer().greater(0).required(),
  description: Joi.string().min(4).max(30).required(),
  type: Joi.alternatives()
    .try(...transactionTypes)
    .required(),
  date: Joi.date().iso().required(),
});

export const transactionUpdateSchema = Joi.object({
  valueAtCents: Joi.number().integer().greater(0).optional(),
  description: Joi.string().min(4).max(30).optional(),
  type: Joi.alternatives()
    .try(...transactionTypes)
    .optional(),
  date: Joi.date().iso().optional(),
});

export const transactionParamsSchema = Joi.object({
  id: Joi.string().length(24).required(),
});
