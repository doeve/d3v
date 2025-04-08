const Simulation = require('../models/simulation');
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const CopyTrade = require('../models/copyTrade');
const copyTradeService = require('./copyTradeService');
const tatumService = require('./tatumService');

class SimulationService {
  // Create a new simulation environment
  async createSimulation(userId, data) {
    try {
      // Create the simulation
      const simulation = await Simulation.create({
        userId,
        name: data.name,
        initialBalance: data.initialBalance || 10000,
        currentBalance: data.initialBalance || 10000,
        blockchain: data.blockchain || 'solana',
        settings: data.settings || {},
        startDate: Date.now()
      });
      
      // Create simulated wallets
      const mainWallet = await Wallet.create({
        userId,
        name: 'Simulation Main Wallet',
        address: `sim_${simulation._id}_main_${Date.now()}`,
        blockchain: simulation.blockchain,
        balance: simulation.initialBalance,
        isSimulated: true
      });
      
      // Add wallet to simulation
      simulation.wallets.push(mainWallet._id);
      await simulation.save();
      
      return {
        simulation,
        mainWallet
      };
    } catch (error) {
      console.error('Simulation creation error:', error);
      throw new Error(`Failed to create simulation: ${error.message}`);
    }
  }
  
  // Add wallet to track in simulation
  async addTrackedWallet(simulationId, userId, data) {
    try {
      const simulation = await Simulation.findOne({
        _id: simulationId,
        userId
      });
      
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      // Create a wallet for tracking
      const wallet = await Wallet.create({
        userId,
        name: data.name,
        address: data.address,
        blockchain: simulation.blockchain,
        isSimulated: true,
        isTracked: true
      });
      
      // Add to simulation
      simulation.wallets.push(wallet._id);
      await simulation.save();
      
      return wallet;
    } catch (error) {
      console.error('Add tracked wallet error:', error);
      throw new Error(`Failed to add tracked wallet: ${error.message}`);
    }
  }
  
  // Set up copy trading in simulation
  async setupCopyTrade(simulationId, userId, data) {
    try {
      const simulation = await Simulation.findOne({
        _id: simulationId,
        userId
      });
      
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      // Verify that source and target wallets exist
      const sourceWallet = await Wallet.findOne({
        _id: data.sourceWalletId,
        $or: [
          { userId },
          { isTracked: true }
        ]
      });
      
      const targetWallet = await Wallet.findOne({
        _id: data.targetWalletId,
        userId
      });
      
      if (!sourceWallet || !targetWallet) {
        throw new Error('Source or target wallet not found');
      }
      
      // Create copy trade setup
      const copyTrade = await CopyTrade.create({
        userId,
        sourceWalletId: sourceWallet._id,
        targetWalletId: targetWallet._id,
        ratioType: data.ratioType || 'dynamic',
        ratioValue: data.ratioValue,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        tokens: data.tokens || [],
        isSimulated: true
      });
      
      // Add to simulation
      simulation.copyTrades.push(copyTrade._id);
      await simulation.save();
      
      return copyTrade;
    } catch (error) {
      console.error('Copy trade setup error:', error);
      throw new Error(`Failed to set up copy trade: ${error.message}`);
    }
  }
  
  // Generate simulated transaction for tracked wallet
  async generateSimulatedTransaction(simulationId, walletId, userId) {
    try {
      const simulation = await Simulation.findOne({
        _id: simulationId,
        userId
      });
      
      if (!simulation || simulation.status !== 'active') {
        return null;
      }
      
      const wallet = await Wallet.findOne({
        _id: walletId,
        isTracked: true,
        isSimulated: true
      });
      
      if (!wallet) {
        throw new Error('Wallet not found or not a tracked simulation wallet');
      }
      
      // Generate random transaction type
      const types = ['buy', 'sell', 'transfer', 'swap'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Generate random token
      const tokens = ['SOL', 'USDC', 'BTC', 'ETH', 'USDT'];
      const token = tokens[Math.floor(Math.random() * tokens.length)];
      
      // Generate random amount (1-1000)
      const amount = Math.random() * 1000 + 1;
      
      // Create transaction
      const transaction = await Transaction.create({
        walletId,
        userId,
        txHash: `sim_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        type,
        amount,
        token,
        timestamp: Date.now(),
        status: 'completed',
        isSimulated: true,
        details: {
          simulation: simulationId,
          generated: true
        }
      });
      
      // Process copy trades based on this transaction
      const copyTrades = await CopyTrade.find({
        sourceWalletId: walletId,
        status: 'active',
        isSimulated: true
      });
      
      for (const copyTrade of copyTrades) {
        await copyTradeService.processCopyTrade(copyTrade, transaction);
      }
      
      // Update wallet balance
      if (type === 'buy' || type === 'transfer') {
        wallet.balance += amount;
      } else if (type === 'sell') {
        wallet.balance = Math.max(0, wallet.balance - amount);
      }
      
      await wallet.save();
      
      return transaction;
    } catch (error) {
      console.error('Simulation transaction error:', error);
      throw new Error(`Failed to generate transaction: ${error.message}`);
    }
  }
  
  // Fast forward simulation
  async fastForward(simulationId, userId, days = 1) {
    try {
      const simulation = await Simulation.findOne({
        _id: simulationId,
        userId
      });
      
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      // Get all tracked wallets in the simulation
      const trackedWallets = await Wallet.find({
        _id: { $in: simulation.wallets },
        isTracked: true,
        isSimulated: true
      });
      
      // Generate multiple transactions for each day
      const transactions = [];
      
      // For each day
      for (let day = 0; day < days; day++) {
        // For each wallet
        for (const wallet of trackedWallets) {
          // Generate 0-5 transactions per day per wallet
          const txCount = Math.floor(Math.random() * 6);
          
          for (let i = 0; i < txCount; i++) {
            const tx = await this.generateSimulatedTransaction(simulationId, wallet._id, userId);
            if (tx) transactions.push(tx);
          }
        }
      }
      
      // Update simulation statistics
      await this.updateSimulationPerformance(simulationId);
      
      return {
        transactions,
        days
      };
    } catch (error) {
      console.error('Fast forward error:', error);
      throw new Error(`Failed to fast forward simulation: ${error.message}`);
    }
  }
  
  // Update simulation performance statistics
  async updateSimulationPerformance(simulationId) {
    try {
      const simulation = await Simulation.findById(simulationId);
      
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      // Get all wallets in the simulation
      const wallets = await Wallet.find({
        _id: { $in: simulation.wallets },
        isSimulated: true
      });
      
      // Calculate total balance
      let totalBalance = 0;
      for (const wallet of wallets) {
        totalBalance += wallet.balance;
      }
      
      // Get transaction count
      const transactionCount = await Transaction.countDocuments({
        walletId: { $in: simulation.wallets },
        isSimulated: true
      });
      
      // Calculate profit/loss
      const profitLoss = totalBalance - simulation.initialBalance;
      
      // Calculate success rate (simplified for demo)
      const successfulTxCount = await Transaction.countDocuments({
        walletId: { $in: simulation.wallets },
        isSimulated: true,
        status: 'completed'
      });
      
      const successRate = transactionCount > 0 ? (successfulTxCount / transactionCount) * 100 : 0;
      
      // Update simulation
      simulation.currentBalance = totalBalance;
      simulation.performance = {
        profitLoss,
        roi: (profitLoss / simulation.initialBalance) * 100,
        transactions: transactionCount,
        successRate
      };
      
      await simulation.save();
      
      return simulation.performance;
    } catch (error) {
      console.error('Performance update error:', error);
      throw new Error(`Failed to update performance: ${error.message}`);
    }
  }
  
  // Reset simulation
  async resetSimulation(simulationId, userId) {
    try {
      const simulation = await Simulation.findOne({
        _id: simulationId,
        userId
      });
      
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      // Reset balance
      simulation.currentBalance = simulation.initialBalance;
      simulation.performance = {
        profitLoss: 0,
        roi: 0,
        transactions: 0,
        successRate: 0
      };
      
      // Reset wallets
      await Wallet.updateMany(
        { _id: { $in: simulation.wallets } },
        { $set: { balance: 0 } }
      );
      
      // Set main wallet to initial balance
      const mainWallet = await Wallet.findOne({
        _id: { $in: simulation.wallets },
        isSimulated: true,
        isTracked: false
      });
      
      if (mainWallet) {
        mainWallet.balance = simulation.initialBalance;
        await mainWallet.save();
      }
      
      // Delete all transactions
      await Transaction.deleteMany({
        walletId: { $in: simulation.wallets },
        isSimulated: true
      });
      
      // Reset simulation start date
      simulation.startDate = Date.now();
      simulation.endDate = null;
      simulation.status = 'active';
      
      await simulation.save();
      
      return simulation;
    } catch (error) {
      console.error('Simulation reset error:', error);
      throw new Error(`Failed to reset simulation: ${error.message}`);
    }
  }
}

module.exports = new SimulationService();