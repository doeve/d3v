const User = require('../models/user');
const Wallet = require('../models/wallet');
const CopyTrade = require('../models/copyTrade');
const Simulation = require('../models/simulation');
const Transaction = require('../models/transaction');
const { AsyncError } = require('../utils/errorHandler');

// Get all users (admin only)
exports.getAllUsers = AsyncError(async (req, res, next) => {
  const users = await User.find().select('-keyHash -encryptionSalt');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// Get a single user by ID (admin only)
exports.getUser = AsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-keyHash -encryptionSalt');
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update user (admin only)
exports.updateUser = AsyncError(async (req, res, next) => {
  const { isAdmin, settings } = req.body;
  
  const updateData = {};
  if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
  if (settings) updateData.settings = settings;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-keyHash -encryptionSalt');
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Delete user (admin only)
exports.deleteUser = AsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  // Prevent self-deletion
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot delete your own account'
    });
  }
  
  // Delete all associated data
  await Wallet.deleteMany({ userId: user._id });
  await CopyTrade.deleteMany({ userId: user._id });
  await Simulation.deleteMany({ userId: user._id });
  await Transaction.deleteMany({ userId: user._id });
  
  // Delete the user
  await user.remove();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get system stats (admin only)
exports.getSystemStats = AsyncError(async (req, res, next) => {
  const [
    totalUsers,
    totalWallets,
    totalCopyTrades,
    totalTransactions,
    activeUsers
  ] = await Promise.all([
    User.countDocuments(),
    Wallet.countDocuments(),
    CopyTrade.countDocuments(),
    Transaction.countDocuments(),
    User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
  ]);
  
  // Calculate other stats
  const walletsByBlockchain = await Wallet.aggregate([
    {
      $group: {
        _id: '$blockchain',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const copyTradeStats = await CopyTrade.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      wallets: {
        total: totalWallets,
        byBlockchain: walletsByBlockchain
      },
      copyTrades: {
        total: totalCopyTrades,
        byStatus: copyTradeStats
      },
      transactions: {
        total: totalTransactions
      }
    }
  });
});