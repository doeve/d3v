const CopyTrade = require('../models/copyTrade');
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const copyTradeService = require('../services/copyTradeService');
const { AsyncError } = require('../utils/errorHandler');

// Get all copy trades for current user
exports.getCopyTrades = AsyncError(async (req, res, next) => {
  const copyTrades = await CopyTrade.find({ userId: req.user._id });
  
  res.status(200).json({
    status: 'success',
    results: copyTrades.length,
    data: {
      copyTrades
    }
  });
});

// Get a single copy trade
exports.getCopyTrade = AsyncError(async (req, res, next) => {
  const copyTrade = await CopyTrade.findOne({
    _id: req.params.id,
    userId: req.user._id
  }).populate('sourceWalletId targetWalletId');
  
  if (!copyTrade) {
    return res.status(404).json({
      status: 'error',
      message: 'Copy trade setup not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      copyTrade
    }
  });
});

// Create a new copy trade setup
exports.createCopyTrade = AsyncError(async (req, res, next) => {
  const {
    sourceWalletId,
    targetWalletId,
    ratioType,
    ratioValue,
    minAmount,
    maxAmount,
    tokens,
    isSimulated
  } = req.body;
  
  // Check if source and target wallets exist and belong to the user
  const sourceWallet = await Wallet.findOne({
    _id: sourceWalletId,
    $or: [
      { userId: req.user._id },
      { isTracked: true }
    ]
  });
  
  const targetWallet = await Wallet.findOne({
    _id: targetWalletId,
    userId: req.user._id
  });
  
  if (!sourceWallet) {
    return res.status(404).json({
      status: 'error',
      message: 'Source wallet not found or not accessible'
    });
  }
  
  if (!targetWallet) {
    return res.status(404).json({
      status: 'error',
      message: 'Target wallet not found or not accessible'
    });
  }
  
  // Create copy trade setup
  const copyTradeData = {
    userId: req.user._id,
    sourceWalletId,
    targetWalletId,
    ratioType: ratioType || 'dynamic',
    isSimulated: isSimulated || false
  };
  
  // Add optional fields if provided
  if (ratioValue) copyTradeData.ratioValue = ratioValue;
  if (minAmount) copyTradeData.minAmount = minAmount;
  if (maxAmount) copyTradeData.maxAmount = maxAmount;
  if (tokens) copyTradeData.tokens = tokens;
  
  const copyTrade = await CopyTrade.create(copyTradeData);
  
  // If source wallet is not already tracked, mark it as tracked
  if (!sourceWallet.isTracked && sourceWallet.userId.toString() !== req.user._id.toString()) {
    sourceWallet.isTracked = true;
    await sourceWallet.save();
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      copyTrade
    }
  });
});

// Update copy trade setup
exports.updateCopyTrade = AsyncError(async (req, res, next) => {
  const {
    ratioType,
    ratioValue,
    minAmount,
    maxAmount,
    tokens,
    status,
    isSimulated
  } = req.body;
  
  // Build update object with provided fields only
  const updateData = {};
  if (ratioType !== undefined) updateData.ratioType = ratioType;
  if (ratioValue !== undefined) updateData.ratioValue = ratioValue;
  if (minAmount !== undefined) updateData.minAmount = minAmount;
  if (maxAmount !== undefined) updateData.maxAmount = maxAmount;
  if (tokens !== undefined) updateData.tokens = tokens;
  if (status !== undefined) updateData.status = status;
  if (isSimulated !== undefined) updateData.isSimulated = isSimulated;
  
  const copyTrade = await CopyTrade.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!copyTrade) {
    return res.status(404).json({
      status: 'error',
      message: 'Copy trade setup not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      copyTrade
    }
  });
});

// Delete copy trade setup
exports.deleteCopyTrade = AsyncError(async (req, res, next) => {
  const copyTrade = await CopyTrade.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!copyTrade) {
    return res.status(404).json({
      status: 'error',
      message: 'Copy trade setup not found'
    });
  }
  
  // Delete the copy trade
  await copyTrade.remove();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get copy trade statistics
exports.getCopyTradeStatistics = AsyncError(async (req, res, next) => {
  const copyTrade = await CopyTrade.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!copyTrade) {
    return res.status(404).json({
      status: 'error',
      message: 'Copy trade setup not found'
    });
  }
  
  // Update statistics before returning
  const statistics = await copyTradeService.updateCopyTradeStatistics(copyTrade._id);
  
  res.status(200).json({
    status: 'success',
    data: {
      statistics
    }
  });
});

// Get copy trade transactions
exports.getCopyTradeTransactions = AsyncError(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  // Check if copy trade exists and belongs to user
  const copyTrade = await CopyTrade.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!copyTrade) {
    return res.status(404).json({
      status: 'error',
      message: 'Copy trade setup not found'
    });
  }
  
  // Get transactions for this copy trade with pagination
  const skip = (page - 1) * limit;
  
  const transactions = await Transaction.find({ copyTradeId: copyTrade._id })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(Number(limit));
  
  const total = await Transaction.countDocuments({ copyTradeId: copyTrade._id });
  
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: {
      transactions
    }
  });
});