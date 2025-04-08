const Wallet = require('../models/wallet');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const tatumService = require('../services/tatumService');
const { AsyncError } = require('../utils/errorHandler');
const { encryptData, decryptData } = require('../utils/encryption');

// Get all wallets for current user
exports.getWallets = AsyncError(async (req, res, next) => {
  const wallets = await Wallet.find({ userId: req.user._id });
  
  res.status(200).json({
    status: 'success',
    results: wallets.length,
    data: {
      wallets
    }
  });
});

// Get a single wallet
exports.getWallet = AsyncError(async (req, res, next) => {
  const wallet = await Wallet.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!wallet) {
    return res.status(404).json({
      status: 'error',
      message: 'Wallet not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      wallet
    }
  });
});

// Create a new wallet
exports.createWallet = AsyncError(async (req, res, next) => {
  const { name, blockchain, isSimulated, isTracked, address } = req.body;
  
  let walletData = {
    userId: req.user._id,
    name,
    blockchain,
    isSimulated: isSimulated || false,
    isTracked: isTracked || false
  };
  
  // For tracked wallets, just store the address
  if (isTracked && address) {
    walletData.address = address;
  } 
  // For simulated wallets, generate a random address
  else if (isSimulated) {
    walletData.address = `sim_${blockchain}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  } 
  // For real wallets, generate through Tatum
  else {
    try {
      // Get encryption key for this user
      const encryptionKey = req.user.deriveEncryptionKey(req.body.key);
      
      // Generate wallet using Tatum
      const generatedWallet = await tatumService.generateWallet(blockchain, encryptionKey);
      
      // Generate address from the wallet
      const addressData = await tatumService.generateAddress(blockchain, generatedWallet.xpub);
      
      // Store wallet data
      walletData.address = addressData.address;
      walletData.privateKey = generatedWallet.mnemonic; // Already encrypted
      
      // Create webhook subscription for address monitoring
      const subscription = await tatumService.createAddressWebhook(
        blockchain,
        addressData.address,
        walletData._id
      );
      
      walletData.tatumSubscriptionId = subscription.id;
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: `Failed to create wallet: ${error.message}`
      });
    }
  }
  
  const wallet = await Wallet.create(walletData);
  
  res.status(201).json({
    status: 'success',
    data: {
      wallet
    }
  });
});

// Update wallet
exports.updateWallet = AsyncError(async (req, res, next) => {
  const { name } = req.body;
  
  const wallet = await Wallet.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { name },
    { new: true, runValidators: true }
  );
  
  if (!wallet) {
    return res.status(404).json({
      status: 'error',
      message: 'Wallet not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      wallet
    }
  });
});

// Delete wallet
exports.deleteWallet = AsyncError(async (req, res, next) => {
  const wallet = await Wallet.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!wallet) {
    return res.status(404).json({
      status: 'error',
      message: 'Wallet not found'
    });
  }
  
  // Delete webhook subscription if it exists
  if (wallet.tatumSubscriptionId) {
    try {
      await tatumService.deleteWebhook(wallet.tatumSubscriptionId);
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  }
  
  // Delete the wallet
  await wallet.remove();
  
  // Also delete all wallet transactions
  await Transaction.deleteMany({ walletId: wallet._id });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get wallet balance and token holdings
exports.getWalletBalance = AsyncError(async (req, res, next) => {
  const wallet = await Wallet.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!wallet) {
    return res.status(404).json({
      status: 'error',
      message: 'Wallet not found'
    });
  }
  
  // For simulated or tracked wallets, just return the stored balance
  if (wallet.isSimulated || wallet.isTracked) {
    return res.status(200).json({
      status: 'success',
      data: {
        balance: wallet.balance,
        tokens: wallet.tokens
      }
    });
  }
  
  // For real wallets, get balance from Tatum
  try {
    const balanceData = await tatumService.getBalance(wallet.blockchain, wallet.address);
    
    // Update wallet with latest balance
    wallet.balance = balanceData.balance;
    wallet.tokens = balanceData.tokens || [];
    wallet.lastSynced = Date.now();
    await wallet.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        balance: balanceData.balance,
        tokens: balanceData.tokens || []
      }
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `Failed to get balance: ${error.message}`
    });
  }
});

// Import existing wallet
exports.importWallet = AsyncError(async (req, res, next) => {
  const { name, blockchain, privateKey, address } = req.body;
  
  // Get encryption key for this user
  const encryptionKey = req.user.deriveEncryptionKey(req.body.key);
  
  // Encrypt the private key
  const encryptedPrivateKey = encryptData(privateKey, encryptionKey);
  
  const walletData = {
    userId: req.user._id,
    name,
    blockchain,
    address,
    privateKey: encryptedPrivateKey,
    isSimulated: false,
    isTracked: false
  };
  
  // Create webhook subscription for address monitoring
  try {
    const subscription = await tatumService.createAddressWebhook(
      blockchain,
      address,
      walletData._id
    );
    
    walletData.tatumSubscriptionId = subscription.id;
  } catch (error) {
    console.error('Failed to create webhook:', error);
  }
  
  const wallet = await Wallet.create(walletData);
  
  res.status(201).json({
    status: 'success',
    data: {
      wallet
    }
  });
});