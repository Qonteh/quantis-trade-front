
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWalletBalance,
  deposit,
  withdraw,
  transfer,
  transferToPlatform,
  getTransactionHistory
} = require('../controllers/trading');

router.get('/balance', protect, getWalletBalance);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.post('/platform-transfer', protect, transferToPlatform);
router.get('/history', protect, getTransactionHistory);

module.exports = router;
