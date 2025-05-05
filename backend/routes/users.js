
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUser,
  updateUser,
  deleteUser,
  getUserVerificationStatus
} = require('../controllers/users');

router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.get('/:id/verification', protect, getUserVerificationStatus);

module.exports = router;
