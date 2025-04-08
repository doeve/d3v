const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.length === 16;
      },
      message: props => 'Key must be exactly 16 characters'
    }
  },
  keyHash: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  encryptionSalt: String // Used for encrypting wallet data
});

// Pre-save hook to hash the key
userSchema.pre('save', async function(next) {
  // Only hash the key if it's new or modified
  if (!this.isModified('key')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the key
    this.keyHash = await bcrypt.hash(this.key, salt);
    
    // Generate encryption salt for wallet data
    this.encryptionSalt = crypto.randomBytes(16).toString('hex');
    
    // Don't store the original key
    this.key = undefined;
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if the provided key is correct
userSchema.methods.matchKey = async function(enteredKey) {
  return await bcrypt.compare(enteredKey, this.keyHash);
};

// Method to derive encryption key from the user's key for wallet data encryption
userSchema.methods.deriveEncryptionKey = function(userKey) {
  return crypto.pbkdf2Sync(
    userKey, 
    Buffer.from(this.encryptionSalt, 'hex'),
    10000,
    32,
    'sha512'
  ).toString('hex');
};

const User = mongoose.model('User', userSchema);

module.exports = User;