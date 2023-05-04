export function validateBody(schema) {
  return validate(schema, "body");
}

export function validateParams(schema) {
  return validate(schema, "params");
}

function validate(schema, type) {
  return (req, res, next) => {
    const { error } = schema.validate(req[type], {
      abortEarly: false,
    });

    if (!error) {
      next();
    } else {
      console.log(error.details.map((detail) => detail.message));
      res.sendStatus(422);
      return;
    }
  };
}
