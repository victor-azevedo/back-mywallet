import Joi from "joi";
import j2s from "joi-to-swagger";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const { swagger: registerSchemaSwagger } = j2s(registerSchema);
export const { swagger: loginSchemaSwagger } = j2s(loginSchema);
