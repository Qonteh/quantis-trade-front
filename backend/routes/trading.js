
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWalletBalance,
  deposit,
  withdraw,
  transfer,
  transferToPlatform,
  getTransactionHistory,
  getAccountDetails,
  getMTServerStatus,
  createMTAccount,
  getMTAccounts
} = require('../controllers/trading');

router.get('/balance', protect, getWalletBalance);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.post('/platform-transfer', protect, transferToPlatform);
router.get('/history', protect, getTransactionHistory);
router.get('/account-details', protect, getAccountDetails);

// MT Server related routes
router.get('/mt-servers/status', protect, getMTServerStatus);
router.post('/mt-accounts', protect, createMTAccount);
router.get('/mt-accounts', protect, getMTAccounts);

module.exports = router;
