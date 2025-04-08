// Error handling middleware for D3V application

// AsyncError wrapper function for route handlers
exports.AsyncError = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  // Custom error class for application errors
  class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  exports.AppError = AppError;
  
  // Global error handling middleware
  module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    // Development error response - more details
    if (process.env.NODE_ENV === 'development') {
      return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
    } 
    
    // Production error response - less details
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } 
    
    // For programming or unknown errors, don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  };