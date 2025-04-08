// Rate limiter middleware for D3V application
const rateLimit = require('express-rate-limit');
const { AppError } = require('./errorHandler');

// Create a rate limiter instance
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  }
});

// Specific API endpoints might need different rate limits
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  message: 'Too many login attempts, please try again after an hour',
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  }
});

module.exports = limiter;
module.exports.authLimiter = authLimiter;