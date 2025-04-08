const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Create new user (admin only)
router.post('/users', auth.protect, auth.restrictToAdmin, authController.createUser);

module.exports = router;