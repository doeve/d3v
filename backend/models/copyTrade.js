const mongoose = require('mongoose');

const copyTradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceWalletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  targetWalletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  ratioType: {
    type: String,
    enum: ['fixed', 'dynamic', 'custom'],
    default: 'dynamic'
  },
  ratioValue: {
    type: Number,
    default: 1.0 // For fixed ratio
  },
  minAmount: {
    type: Number,
    default: 0
  },
  maxAmount: {
    type: Number,
    default: 0 // 0 means no max limit
  },
  tokens: {
    type: [String],
    default: [] // Empty array means all tokens
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'stopped'],
    default: 'active'
  },
  isSimulated: {
    type: Boolean,
    default: false
  },
  statistics: {
    totalTrades: {
      type: Number,
      default: 0
    },
    successfulTrades: {
      type: Number,
      default: 0
    },
    failedTrades: {
      type: Number,
      default: 0
    },
    totalInvested: {
      type: Number,
      default: 0
    },
    currentValue: {
      type: Number,
      default: 0
    },
    roi: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update timestamps
copyTradeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CopyTrade = mongoose.model('CopyTrade', copyTradeSchema);

module.exports = CopyTrade;