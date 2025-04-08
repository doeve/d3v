const express = require('express');
const walletController = require('../controllers/walletController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all wallet routes
router.use(auth.protect);

// Wallet routes
router.route('/')
  .get(walletController.getWallets)
  .post(walletController.createWallet);

router.route('/:id')
  .get(walletController.getWallet)
  .patch(walletController.updateWallet)
  .delete(walletController.deleteWallet);

router.get('/:id/balance', walletController.getWalletBalance);
router.post('/import', walletController.importWallet);

module.exports = router;