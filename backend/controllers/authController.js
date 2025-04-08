const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { encryptData, decryptData } = require('../utils/encryption');
const { AsyncError } = require('../utils/errorHandler');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Login with 16-character key
exports.login = AsyncError(async (req, res, next) => {
  const { key } = req.body;

  // Check if key is provided
  if (!key) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide your 16-character key'
    });
  }

  // Check if key is exactly 16 characters
  if (key.length !== 16) {
    return res.status(400).json({
      status: 'error',
      message: 'Key must be exactly 16 characters'
    });
  }

  // Find the user by comparing the hashed key
  // Need to get all users since we can't search by hashed values
  const users = await User.find({});
  
  // Find the user with matching key
  let user = null;
  for (const u of users) {
    if (await u.matchKey(key)) {
      user = u;
      break;
    }
  }

  // If no user is found
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid key'
    });
  }

  // Update last login time
  user.lastLogin = Date.now();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        isAdmin: user.isAdmin,
        settings: user.settings,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    }
  });
});

// Create a new user (only admin can do this)
exports.createUser = AsyncError(async (req, res, next) => {
  const { key } = req.body;
  
  // Check if the current user is an admin
  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Only admins can create new users'
    });
  }

  // Create a new user
  const newUser = await User.create({
    key,
    isAdmin: false,
    createdBy: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: newUser._id,
        createdAt: newUser.createdAt
      },
      key: key // Return the key since it will be hidden in the database
    }
  });
});