const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  initialBalance: {
    type: Number,
    required: true,
    default: 10000 // Default initial balance (e.g., $10,000)
  },
  currentBalance: {
    type: Number,
    default: function() {
      return this.initialBalance;
    }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  blockchain: {
    type: String,
    enum: ['solana', 'ethereum', 'bitcoin', 'binance', 'polygon', 'avalanche', 'other'],
    default: 'solana'
  },
  wallets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  }],
  copyTrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CopyTrade'
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  settings: {
    speed: {
      type: Number,
      default: 1 // Simulation speed multiplier
    },
    marketVolatility: {
      type: Number,
      default: 1 // Market volatility factor
    },
    fees: {
      type: Number,
      default: 0.1 // Transaction fee percentage
    }
  },
  marketData: {
    type: mongoose.Schema.Types.Mixed,
    default: {} // Simulated market data
  },
  performance: {
    profitLoss: {
      type: Number,
      default: 0
    },
    roi: {
      type: Number,
      default: 0
    },
    transactions: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
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

// Pre-save hook to update timestamp and calculate ROI
simulationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate ROI
  if (this.initialBalance > 0) {
    this.performance.roi = ((this.currentBalance - this.initialBalance) / this.initialBalance) * 100;
  }
  
  next();
});

const Simulation = mongoose.model('Simulation', simulationSchema);

module.exports = Simulation;