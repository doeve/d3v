const express = require('express');
const simulationController = require('../controllers/simulationController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all simulation routes
router.use(auth.protect);

// Simulation routes
router.route('/')
  .get(simulationController.getSimulations)
  .post(simulationController.createSimulation);

router.route('/:id')
  .get(simulationController.getSimulation)
  .patch(simulationController.updateSimulation)
  .delete(simulationController.deleteSimulation);

router.post('/:id/wallets', simulationController.addTrackedWallet);
router.post('/:id/copy-trades', simulationController.setupCopyTrade);
router.post('/:id/transactions', simulationController.generateTransaction);
router.post('/:id/fast-forward', simulationController.fastForward);
router.get('/:id/performance', simulationController.getPerformance);
router.post('/:id/reset', simulationController.resetSimulation);

module.exports = router;