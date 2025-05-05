
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

// @desc    Transfer funds to trading platform (MT4/MT5)
// @route   POST /api/trading/platform-transfer
// @access  Private
exports.transferToPlatform = async (req, res, next) => {
  const t = await sequelize.transaction();
  
  try {
    const { amount, platform, accountType } = req.body;

    if (!amount || amount <= 0 || !platform || !accountType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide valid amount, platform, and account type' 
      });
    }

    const user = await User.findByPk(req.user.id, { transaction: t });

    // Check if user has enough balance based on account type
    const balanceField = accountType === 'demo' ? 'demoBalance' : 'walletBalance';
    if (parseFloat(user[balanceField]) < parseFloat(amount)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insufficient funds' 
      });
    }

    // Update user balance
    user[balanceField] = parseFloat(user[balanceField]) - parseFloat(amount);
    await user.save({ transaction: t });
    
    // In a real application, you would send the funds to the trading platform
    // For now, we'll just create a transaction record
    await Transaction.create({
      userId: user.id,
      type: `platform_transfer_${accountType}`,
      amount,
      status: 'completed',
      reference: `PTF-${platform}-${Date.now()}`,
      metadata: JSON.stringify({ platform, leverage: '1:2000' })
    }, { transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      data: {
        [balanceField]: user[balanceField],
        transferAmount: amount,
        platform,
        leverage: '1:2000'
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

// @desc    Get user trading account details
// @route   GET /api/trading/account-details
// @access  Private
exports.getAccountDetails = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        leverage: user.leverage || '1:2000',
        accountType: user.accountType || 'Standard',
        tradingServer: user.tradingServer || 'Quantis-Live',
        walletBalance: user.walletBalance,
        demoBalance: user.demoBalance
      }
    });
  } catch (err) {
    next(err);
  }
};
