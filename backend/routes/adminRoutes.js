const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Protect all admin routes with authentication
router.use(auth.protect);

// Protect all admin routes with admin check
router.use(admin.isAdmin);

// User management routes
router.route('/users')
  .get(adminController.getAllUsers);

router.route('/users/:id')
  .get(adminController.getUser)
  .patch(adminController.updateUser)
  .delete(adminController.deleteUser);

// System stats route
router.get('/stats', adminController.getSystemStats);

module.exports = router;