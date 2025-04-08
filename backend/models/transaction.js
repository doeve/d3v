const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  txHash: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell', 'transfer', 'swap', 'stake', 'unstake', 'reward', 'fee', 'other'],
    default: 'other'
  },
  amount: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  isSimulated: {
    type: Boolean,
    default: false
  },
  copyTradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CopyTrade',
    default: null
  },
  sourceTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Index for faster queries
transactionSchema.index({ walletId: 1, timestamp: -1 });
transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ copyTradeId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;