const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
    trim: true
  },
  blockchain: {
    type: String,
    required: true,
    enum: ['solana', 'ethereum', 'bitcoin', 'binance', 'polygon', 'avalanche', 'other']
  },
  privateKey: {
    type: String,
    select: false // Not included in query results by default
  },
  balance: {
    type: Number,
    default: 0
  },
  tokens: [{
    symbol: String,
    name: String,
    address: String,
    balance: Number,
    price: Number,
    priceTimestamp: Date
  }],
  isSimulated: {
    type: Boolean,
    default: false
  },
  isTracked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastSynced: {
    type: Date,
    default: null
  },
  tatumSubscriptionId: {
    type: String,
    default: null
  }
});

// Update the 'updatedAt' field on save
walletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;