const Simulation = require('../models/simulation');
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const CopyTrade = require('../models/copyTrade');
const simulationService = require('../services/simulationService');
const { AsyncError } = require('../utils/errorHandler');

// Get all simulations for current user
exports.getSimulations = AsyncError(async (req, res, next) => {
  const simulations = await Simulation.find({ userId: req.user._id });
  
  res.status(200).json({
    status: 'success',
    results: simulations.length,
    data: {
      simulations
    }
  });
});

// Get a single simulation
exports.getSimulation = AsyncError(async (req, res, next) => {
  const simulation = await Simulation.findOne({
    _id: req.params.id,
    userId: req.user._id
  }).populate('wallets copyTrades');
  
  if (!simulation) {
    return res.status(404).json({
      status: 'error',
      message: 'Simulation not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      simulation
    }
  });
});

// Create a new simulation
exports.createSimulation = AsyncError(async (req, res, next) => {
  const { name, initialBalance, blockchain, settings } = req.body;
  
  const result = await simulationService.createSimulation(req.user._id, {
    name,
    initialBalance,
    blockchain,
    settings
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      simulation: result.simulation,
      mainWallet: result.mainWallet
    }
  });
});

// Update simulation
exports.updateSimulation = AsyncError(async (req, res, next) => {
  const { name, status, settings } = req.body;
  
  // Build update object
  const updateData = {};
  if (name) updateData.name = name;
  if (status) updateData.status = status;
  if (settings) updateData.settings = settings;
  
  const simulation = await Simulation.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!simulation) {
    return res.status(404).json({
      status: 'error',
      message: 'Simulation not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      simulation
    }
  });
});

// Delete simulation
exports.deleteSimulation = AsyncError(async (req, res, next) => {
  const simulation = await Simulation.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!simulation) {
    return res.status(404).json({
      status: 'error',
      message: 'Simulation not found'
    });
  }
  
  // Delete all related wallets
  await Wallet.deleteMany({
    _id: { $in: simulation.wallets }
  });
  
  // Delete all related copy trades
  await CopyTrade.deleteMany({
    _id: { $in: simulation.copyTrades }
  });
  
  // Delete all transactions
  await Transaction.deleteMany({
    walletId: { $in: simulation.wallets }
  });
  
  // Delete the simulation
  await simulation.remove();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Add tracked wallet to simulation
exports.addTrackedWallet = AsyncError(async (req, res, next) => {
  const { name, address } = req.body;
  
  if (!name || !address) {
    return res.status(400).json({
      status: 'error',
      message: 'Name and address are required'
    });
  }
  
  const wallet = await simulationService.addTrackedWallet(req.params.id, req.user._id, {
    name,
    address
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      wallet
    }
  });
});

// Set up copy trading in simulation
exports.setupCopyTrade = AsyncError(async (req, res, next) => {
  const {
    sourceWalletId,
    targetWalletId,
    ratioType,
    ratioValue,
    minAmount,
    maxAmount,
    tokens
  } = req.body;
  
  if (!sourceWalletId || !targetWalletId) {
    return res.status(400).json({
      status: 'error',
      message: 'Source and target wallet IDs are required'
    });
  }
  
  const copyTrade = await simulationService.setupCopyTrade(req.params.id, req.user._id, {
    sourceWalletId,
    targetWalletId,
    ratioType,
    ratioValue,
    minAmount,
    maxAmount,
    tokens
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      copyTrade
    }
  });
});

// Generate simulated transaction
exports.generateTransaction = AsyncError(async (req, res, next) => {
  const { walletId } = req.body;
  
  if (!walletId) {
    return res.status(400).json({
      status: 'error',
      message: 'Wallet ID is required'
    });
  }
  
  const transaction = await simulationService.generateSimulatedTransaction(
    req.params.id,
    walletId,
    req.user._id
  );
  
  if (!transaction) {
    return res.status(400).json({
      status: 'error',
      message: 'Failed to generate transaction'
    });
  }
  
  // Update simulation performance
  await simulationService.updateSimulationPerformance(req.params.id);
  
  res.status(201).json({
    status: 'success',
    data: {
      transaction
    }
  });
});

// Fast forward simulation
exports.fastForward = AsyncError(async (req, res, next) => {
  const { days } = req.body;
  
  if (!days || isNaN(days) || days <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Valid number of days is required'
    });
  }
  
  const result = await simulationService.fastForward(
    req.params.id,
    req.user._id,
    Math.min(days, 30) // Limit to 30 days at a time
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      transactionsGenerated: result.transactions.length,
      daysFastForwarded: result.days
    }
  });
});

// Get simulation performance
exports.getPerformance = AsyncError(async (req, res, next) => {
  const simulation = await Simulation.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!simulation) {
    return res.status(404).json({
      status: 'error',
      message: 'Simulation not found'
    });
  }
  
  // Update and get the latest performance
  const performance = await simulationService.updateSimulationPerformance(simulation._id);
  
  res.status(200).json({
    status: 'success',
    data: {
      performance
    }
  });
});

// Reset simulation
exports.resetSimulation = AsyncError(async (req, res, next) => {
  const simulation = await simulationService.resetSimulation(
    req.params.id,
    req.user._id
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      simulation
    }
  });
});