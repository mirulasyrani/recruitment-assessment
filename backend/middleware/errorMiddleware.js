const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Zod validation error
  if (err instanceof ZodError) {
    console.error('[Zod Validation Error]', err.issues);
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
      timestamp: new Date().toISOString(),
    });
  }

  // Log general errors in non-production
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Server Error] ${err.message}`, err.stack);
  }

  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
    statusCode,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
