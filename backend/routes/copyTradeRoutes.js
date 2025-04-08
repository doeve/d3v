const express = require('express');
const copyTradeController = require('../controllers/copyTradeController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all copy trade routes
router.use(auth.protect);

// Copy trade routes
router.route('/')
  .get(copyTradeController.getCopyTrades)
  .post(copyTradeController.createCopyTrade);

router.route('/:id')
  .get(copyTradeController.getCopyTrade)
  .patch(copyTradeController.updateCopyTrade)
  .delete(copyTradeController.deleteCopyTrade);

router.get('/:id/statistics', copyTradeController.getCopyTradeStatistics);
router.get('/:id/transactions', copyTradeController.getCopyTradeTransactions);

module.exports = router;