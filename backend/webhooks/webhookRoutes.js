const express = require('express');
const tatumWebhooks = require('./tatumWebhooks');

const router = express.Router();

// Tatum transaction webhook route
router.post('/transactions/:walletId', tatumWebhooks.handleTransactionWebhook);

module.exports = router;