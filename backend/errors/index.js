class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const UnauthenticatedError = (message) => new CustomAPIError(message, 401);
const BadRequestError = (message) => new CustomAPIError(message, 400);
const NotFoundError = (message) => new CustomAPIError(message, 404);

module.exports = { CustomAPIError, UnauthenticatedError, BadRequestError, NotFoundError };
