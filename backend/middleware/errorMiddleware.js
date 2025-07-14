const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  // Default to 500 server error
  const statusCode = res.statusCode ? res.statusCode : 500;

  // As suggested, we check if the error is a ZodError.
  if (err instanceof ZodError) {
    // If it is, we return a 400 Bad Request and map the issues to a structured format.
    // This returns ALL validation errors, not just the first one.
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // For all other errors, return a generic message.
  res.status(statusCode).json({
    message: err.message,
    // Provide stack trace only in development environment
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };