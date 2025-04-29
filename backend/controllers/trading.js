
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { sequelize } = require('../config/db');

// @desc    Get wallet balance
// @route   GET /api/trading/balance
// @access  Private
exports.getWalletBalance = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        demoBalance: user.demoBalance
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Deposit funds
// @route   POST /api/trading/deposit
// @access  Private
exports.deposit = async (req, res, next) => {
  const t = await sequelize.transaction();
  
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid amount' 
      });
    }

    // In a real application, you would integrate with a payment processor here

    // Update user balance
    const user = await User.findByPk(req.user.id, { transaction: t });
    
    user.walletBalance = parseFloat(user.walletBalance) + parseFloat(amount);
    await user.save({ transaction: t });
    
    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: 'deposit',
      amount,
      status: 'completed',
      reference: `DEP-${Date.now()}`
    }, { transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        depositAmount: amount
      }
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// @desc    Withdraw funds
// @route   POST /api/trading/withdraw
// @access  Private
exports.withdraw = async (req, res, next) => {
  const t = await sequelize.transaction();
  
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid amount' 
      });
    }

    const user = await User.findByPk(req.user.id, { transaction: t });

    // Check if user has enough balance
    if (parseFloat(user.walletBalance) < parseFloat(amount)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insufficient funds' 
      });
    }

    // In a real application, you would initiate a withdrawal process here

    // Update user balance
    user.walletBalance = parseFloat(user.walletBalance) - parseFloat(amount);
    await user.save({ transaction: t });
    
    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: 'withdraw',
      amount,
      status: 'completed',
      reference: `WDR-${Date.now()}`
    }, { transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        withdrawAmount: amount
      }
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// @desc    Transfer funds
// @route   POST /api/trading/transfer
// @access  Private
exports.transfer = async (req, res, next) => {
  const t = await sequelize.transaction();
  
  try {
    const { toEmail, amount } = req.body;

    if (!toEmail || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide recipient email and valid amount' 
      });
    }

    const sender = await User.findByPk(req.user.id, { transaction: t });

    // Check if sender has enough balance
    if (parseFloat(sender.walletBalance) < parseFloat(amount)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insufficient funds' 
      });
    }

    // Find receiver
    const receiver = await User.findOne({ 
      where: { email: toEmail },
      transaction: t
    });

    if (!receiver) {
      return res.status(404).json({ 
        success: false, 
        error: 'Recipient not found' 
      });
    }

    // Update balances
    sender.walletBalance = parseFloat(sender.walletBalance) - parseFloat(amount);
    receiver.walletBalance = parseFloat(receiver.walletBalance) + parseFloat(amount);

    await sender.save({ transaction: t });
    await receiver.save({ transaction: t });
    
    // Create transaction records
    await Transaction.create({
      userId: sender.id,
      type: 'transfer_out',
      amount,
      status: 'completed',
      reference: `TRF-${Date.now()}`,
      relatedUserId: receiver.id
    }, { transaction: t });
    
    await Transaction.create({
      userId: receiver.id,
      type: 'transfer_in',
      amount,
      status: 'completed',
      reference: `TRF-${Date.now()}`,
      relatedUserId: sender.id
    }, { transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      data: {
        walletBalance: sender.walletBalance,
        transferAmount: amount,
        recipient: toEmail
      }
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// @desc    Get transaction history
// @route   GET /api/trading/history
// @access  Private
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};
