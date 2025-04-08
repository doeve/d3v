// app.js - Main application file for D3V backend

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import route files
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const copyTradeRoutes = require('./routes/copyTradeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiting
app.use('/api/', rateLimiter);

// Middleware for parsing and compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/copy-trade', copyTradeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to D3V API' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;