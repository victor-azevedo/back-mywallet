export function BadRequestError(message = "Bad Request") {
  this.name = "BadRequestError";
  this.message = message;
  this.status = 400;
}

export function UnauthorizedError(message = "Unauthorized") {
  this.name = "UnauthorizedError";
  this.message = message;
  this.status = 401;
}

export function NotFoundError(message = "Resource Not Found") {
  this.name = "NotFoundError";
  this.message = message;
  this.status = 404;
}

export function ConflictError(message = "Conflict") {
  this.name = "ConflictError";
  this.message = message;
  this.status = 409;
}

export function UnprocessableEntityError(message = "Unprocessable Entity") {
  this.name = "UnprocessableEntityError";
  this.message = message;
  this.status = 422;
}

export function handleRequestError(res, error) {
  console.log(error);
  return res
    .status(error.status || 500)
    .send(error.message || "Internal server error");
}
