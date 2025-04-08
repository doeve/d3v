const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const CopyTrade = require('../models/copyTrade');
const copyTradeService = require('../services/copyTradeService');

// Handle transaction webhook
exports.handleTransactionWebhook = async (req, res) => {
  const { walletId } = req.params;
  const webhookData = req.body;
  
  try {
    // Find the wallet
    const wallet = await Wallet.findById(walletId);
    
    if (!wallet) {
      console.error(`Webhook received for unknown wallet: ${walletId}`);
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    // Create transaction record
    const transaction = await Transaction.create({
      walletId: wallet._id,
      userId: wallet.userId,
      txHash: webhookData.txId,
      type: webhookData.operation,
      amount: webhookData.amount,
      token: webhookData.asset,
      timestamp: new Date(webhookData.timestamp),
      status: 'completed',
      isSimulated: false,
      details: webhookData
    });
    
    // Update wallet balance
    wallet.lastSynced = Date.now();
    await wallet.save();
    
    // Check if this wallet is being tracked by any copy trade setups
    if (wallet.isTracked) {
      // Find all active copy trade setups using this wallet as source
      const copyTrades = await CopyTrade.find({
        sourceWalletId: wallet._id,
        status: 'active',
        isSimulated: false
      });
      
      // Process each copy trade
      for (const copyTrade of copyTrades) {
        await copyTradeService.processCopyTrade(copyTrade, transaction);
      }
    }
    
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Error processing webhook' });
  }
};