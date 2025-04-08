const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const CopyTrade = require('../models/copyTrade');
const tatumService = require('./tatumService');
const User = require('../models/user');
const { decryptData } = require('../utils/encryption');

class CopyTradeService {
  // Calculate the wealth ratio between source and target wallets
  async calculateWealthRatio(sourceWallet, targetWallet) {
    // For dynamic ratio, we need to get the total wealth of both wallets
    let sourceWealth = sourceWallet.balance;
    let targetWealth = targetWallet.balance;
    
    // Add token values if available
    if (sourceWallet.tokens && sourceWallet.tokens.length > 0) {
      sourceWealth += sourceWallet.tokens.reduce((sum, token) => sum + (token.balance * token.price || 0), 0);
    }
    
    if (targetWallet.tokens && targetWallet.tokens.length > 0) {
      targetWealth += targetWallet.tokens.reduce((sum, token) => sum + (token.balance * token.price || 0), 0);
    }
    
    // Calculate ratio (target wealth / source wealth)
    const ratio = targetWealth / sourceWealth;
    
    return {
      sourceWealth,
      targetWealth,
      ratio
    };
  }
  
  // Process a copy trade based on a source transaction
  async processCopyTrade(copyTrade, sourceTransaction) {
    try {
      // Skip if copy trade is not active
      if (copyTrade.status !== 'active') {
        return null;
      }
      
      // Get source and target wallets
      const sourceWallet = await Wallet.findById(copyTrade.sourceWalletId);
      const targetWallet = await Wallet.findById(copyTrade.targetWalletId);
      
      if (!sourceWallet || !targetWallet) {
        throw new Error('Source or target wallet not found');
      }
      
      // Check if the token is allowed for this copy trade
      if (
        copyTrade.tokens.length > 0 &&
        !copyTrade.tokens.includes(sourceTransaction.token)
      ) {
        return null;
      }
      
      // Calculate amount to trade based on ratio type
      let amountToTrade;
      
      if (copyTrade.ratioType === 'fixed') {
        // Fixed ratio - use the predefined ratio value
        amountToTrade = sourceTransaction.amount * copyTrade.ratioValue;
      } else if (copyTrade.ratioType === 'dynamic') {
        // Dynamic ratio - calculate based on current wealth ratio
        const { ratio } = await this.calculateWealthRatio(sourceWallet, targetWallet);
        amountToTrade = sourceTransaction.amount * ratio;
      } else {
        // Custom ratio - for future implementation
        amountToTrade = sourceTransaction.amount;
      }
      
      // Apply min/max constraints
      if (copyTrade.minAmount > 0 && amountToTrade < copyTrade.minAmount) {
        amountToTrade = copyTrade.minAmount;
      }
      
      if (copyTrade.maxAmount > 0 && amountToTrade > copyTrade.maxAmount) {
        amountToTrade = copyTrade.maxAmount;
      }
      
      // Create the copy trade transaction
      const transaction = {
        walletId: targetWallet._id,
        userId: copyTrade.userId,
        type: sourceTransaction.type,
        amount: amountToTrade,
        token: sourceTransaction.token,
        timestamp: new Date(),
        copyTradeId: copyTrade._id,
        sourceTransactionId: sourceTransaction._id,
        isSimulated: copyTrade.isSimulated,
        details: {
          sourceAmount: sourceTransaction.amount,
          calculatedRatio: amountToTrade / sourceTransaction.amount
        }
      };
      
      // For simulation, just create the transaction record
      if (copyTrade.isSimulated || targetWallet.isSimulated) {
        transaction.status = 'completed';
        const simulatedTx = await Transaction.create(transaction);
        
        // Update simulation statistics
        await this.updateCopyTradeStatistics(copyTrade._id);
        
        return simulatedTx;
      }
      
      // For real trading, execute via Tatum API
      // Get the user to retrieve encryption key
      const user = await User.findById(copyTrade.userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // We need the user's key for decryption
      // This would typically come from the request in a real scenario
      // For demo, we could store it temporarily in cache during login
      // Here we'll assume we have access to it through req.body.key
      
      // WARNING: This is a simplification for the demo
      // In a real application, you would need a secure way to access the key
      // such as a user session or a temporary cache
      
      // Execute the transaction through Tatum
      // This is pseudo-code as we don't have the actual key
      /*
      const encryptionKey = user.deriveEncryptionKey(req.body.key);
      
      const txBody = {
        to: sourceTransaction.details.to, // Destination address from source tx
        amount: amountToTrade,
        currency: sourceTransaction.token
      };
      
      const result = await tatumService.createTransaction(
        targetWallet.blockchain,
        txBody,
        targetWallet.privateKey,
        encryptionKey
      );
      
      transaction.txHash = result.txId;
      transaction.status = 'pending';
      */
      
      // For demo purposes, create a pending transaction
      transaction.status = 'pending';
      const pendingTx = await Transaction.create(transaction);
      
      // Update copy trade statistics
      await this.updateCopyTradeStatistics(copyTrade._id);
      
      return pendingTx;
    } catch (error) {
      console.error('Copy trade processing error:', error);
      
      // Record the failed transaction
      await Transaction.create({
        walletId: copyTrade.targetWalletId,
        userId: copyTrade.userId,
        type: sourceTransaction.type,
        amount: 0, // Zero amount for failed transaction
        token: sourceTransaction.token,
        timestamp: new Date(),
        status: 'failed',
        copyTradeId: copyTrade._id,
        sourceTransactionId: sourceTransaction._id,
        isSimulated: copyTrade.isSimulated,
        details: {
          error: error.message,
          sourceAmount: sourceTransaction.amount
        }
      });
      
      // Update statistics
      await this.updateCopyTradeStatistics(copyTrade._id);
      
      return null;
    }
  }
  
  // Update copy trade statistics
  async updateCopyTradeStatistics(copyTradeId) {
    try {
      const copyTrade = await CopyTrade.findById(copyTradeId);
      
      if (!copyTrade) {
        throw new Error('Copy trade not found');
      }
      
      // Get all transactions for this copy trade
      const transactions = await Transaction.find({ copyTradeId });
      
      // Calculate statistics
      const totalTrades = transactions.length;
      const successfulTrades = transactions.filter(tx => tx.status === 'completed').length;
      const failedTrades = transactions.filter(tx => tx.status === 'failed').length;
      
      // Calculate total invested and current value
      let totalInvested = 0;
      let currentValue = 0;
      
      for (const tx of transactions) {
        if (tx.status === 'completed') {
          // For buy/transfer in, add to invested amount
          if (['buy', 'transfer'].includes(tx.type)) {
            totalInvested += tx.amount;
            
            // For simplicity, assume current value is the same as invested for now
            // In a real app, you would get current token prices and calculate actual value
            currentValue += tx.amount;
          }
          // For sell/transfer out, subtract from current value
          else if (tx.type === 'sell') {
            currentValue -= tx.amount;
          }
        }
      }
      
      // Calculate ROI
      const roi = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
      
      // Update copy trade statistics
      copyTrade.statistics = {
        totalTrades,
        successfulTrades,
        failedTrades,
        totalInvested,
        currentValue,
        roi,
        lastUpdated: Date.now()
      };
      
      await copyTrade.save();
      
      return copyTrade.statistics;
    } catch (error) {
      console.error('Statistics update error:', error);
      throw error;
    }
  }
}

module.exports = new CopyTradeService();