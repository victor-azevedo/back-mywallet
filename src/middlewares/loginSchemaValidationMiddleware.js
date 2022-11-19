import { loginSchema } from "../models/usersModels.js";

export function loginSchemaValidationMiddleware(req, res, next) {
  const { email, password } = req.body;
  const user = { email, password };

  const { error } = loginSchema.validate(user, { abortEarly: false });
  if (error) {
    console.log(error.details.map((detail) => detail.message));
    res.sendStatus(422);
    return;
  }
  res.locals.user = user;

  next();
}
