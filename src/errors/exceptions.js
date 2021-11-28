class APIError extends Error {
  constructor(name, statusCode, errorCode, message = null) {
    super(message || name);
    this.name = name;
    this.status = statusCode;
    this.errorCode = errorCode;
  }
}

class InvalidBodyError extends APIError {
  constructor() {
    super("InvalidBodyError", 400, "BAD_REQUEST");
  }
}

module.exports = { InvalidBodyError };
