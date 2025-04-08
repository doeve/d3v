// Admin middleware for D3V application
const { AppError } = require('./errorHandler');

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }
  
  next();
};

// Middleware to check system resource access
exports.checkSystemAccess = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError('Access denied. System access requires admin privileges.', 403));
  }
  
  // Check for specific system-level permissions if needed
  // (Can be expanded based on admin roles/permissions)
  
  next();
};

// Middleware to check user management access
exports.checkUserManagementAccess = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError('Access denied. User management requires admin privileges.', 403));
  }
  
  next();
};