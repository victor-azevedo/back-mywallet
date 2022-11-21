import { registerSchema } from "../models/usersModels.js";

export function registerSchemaValidationMiddleware(req, res, next) {
  const { username, email, password, repeatPassword } = req.body;

  const newUser = { username, email, password, repeatPassword };
  const { error } = registerSchema.validate(newUser, { abortEarly: false });
  if (error) {
    console.log(error.details.map((detail) => detail.message));
    res.sendStatus(422);
    return;
  }
  delete newUser.repeatPassword;

  res.locals.newUser = newUser;

  next();
}
