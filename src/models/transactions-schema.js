import Joi from "joi";
import j2s from "joi-to-swagger";

const transactionTypes = ["incoming", "outgoing"];

export const transactionCreateSchema = Joi.object({
  valueInCents: Joi.number().integer().greater(0).required(),
  description: Joi.string().min(4).max(30).required(),
  type: Joi.alternatives()
    .try(...transactionTypes)
    .required(),
  date: Joi.date().iso().required(),
});

export const transactionUpdateSchema = Joi.object({
  valueInCents: Joi.number().integer().greater(0).optional(),
  description: Joi.string().min(4).max(30).optional(),
  type: Joi.alternatives()
    .try(...transactionTypes)
    .optional(),
  date: Joi.date().iso().optional(),
});

export const transactionParamsSchema = Joi.object({
  id: Joi.string().length(24).required(),
});

export const { swagger: transactionCreateSchemaSwagger } = j2s(
  transactionCreateSchema
);
export const { swagger: transactionUpdateSchemaSwagger } = j2s(
  transactionUpdateSchema
);
export const { swagger: transactionParamsSchemaSwagger } = j2s(
  transactionParamsSchema
);
