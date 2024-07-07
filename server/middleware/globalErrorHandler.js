const responseStatus = require("../utils/response/responseStatus");

// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const body = err.body || {
    status: responseStatus.serverError,
    message: err.message || "Internal Server Error.",
    data: process.env.NODE_ENV !== "production" ? { stack: err.stack } : null,
  };

  res.status(statusCode).json(body);
}

module.exports = globalErrorHandler;
