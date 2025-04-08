// MongoDB initialization script
// This script runs when the MongoDB container is created for the first time

print('Start MongoDB initialization script');

// Create database if it doesn't exist
db = db.getSiblingDB('d3v');

// Create admin user for the database
db.createUser({
  user: 'd3v_admin',
  pwd: process.env.MONGO_PASSWORD || 'password123',
  roles: [
    {
      role: 'readWrite',
      db: 'd3v'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['keyHash', 'isAdmin', 'createdAt'],
      properties: {
        keyHash: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        isAdmin: {
          bsonType: 'bool',
          description: 'must be a boolean and is required'
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date and is required'
        }
      }
    }
  }
});

db.createCollection('wallets');
db.createCollection('copy_trades');
db.createCollection('transactions');
db.createCollection('simulations');

// Create indexes
db.users.createIndex({ keyHash: 1 }, { unique: true });
db.wallets.createIndex({ userId: 1 });
db.wallets.createIndex({ address: 1 });
db.transactions.createIndex({ walletId: 1, timestamp: -1 });
db.transactions.createIndex({ userId: 1 });
db.copy_trades.createIndex({ userId: 1 });
db.simulations.createIndex({ userId: 1 });

// Create admin user if it doesn't exist
const adminKeyHash = '$2a$10$X9YqPJYaD7KGfZvAvqwdVejLy8QI2iA.SOEJIzOHLAHGsLsQQj9a2'; // This is a hash for the default key "admin1234567890"

const adminUser = db.users.findOne({ isAdmin: true });
if (!adminUser) {
  db.users.insertOne({
    keyHash: adminKeyHash,
    isAdmin: true,
    createdAt: new Date(),
    lastLogin: null,
    createdBy: null,
    encryptionSalt: '1234567890abcdef',
    settings: {
      theme: 'dark',
      currency: 'USD',
      notifications: true
    }
  });
  print('Admin user created');
}

print('MongoDB initialization completed');