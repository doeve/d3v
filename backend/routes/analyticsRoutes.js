const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all analytics routes
router.use(auth.protect);

// Wallet performance routes
router.get('/wallet/:id/performance', analyticsController.getWalletPerformance);

// Copy trade performance route
router.get('/copy-trade/:id/performance', analyticsController.getCopyTradePerformance);

// Portfolio overview
router.get('/portfolio', analyticsController.getPortfolioOverview);

// Token distribution
router.get('/tokens', analyticsController.getTokenDistribution);

// Trading history
router.get('/trading-history', analyticsController.getTradingHistory);

// Copy trading summary
router.get('/copy-trading', analyticsController.getCopyTradingSummary);

module.exports = router;