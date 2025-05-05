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

// @desc    Get MT Server status
// @route   GET /api/trading/mt-servers/status
// @access  Private
exports.getMTServerStatus = async (req, res, next) => {
  try {
    // In a production environment, you would check the actual status of your MT servers
    // For now, we'll return mock data
    const servers = [
      { 
        server: process.env.VITE_MT4_DEMO_SERVER, 
        status: 'online', 
        uptime: 99.98, 
        message: 'All systems operational' 
      },
      { 
        server: process.env.VITE_MT4_LIVE_SERVER, 
        status: 'online', 
        uptime: 99.95, 
        message: 'All systems operational' 
      },
      { 
        server: process.env.VITE_MT5_DEMO_SERVER, 
        status: 'online', 
        uptime: 99.99, 
        message: 'All systems operational' 
      },
      { 
        server: process.env.VITE_MT5_LIVE_SERVER, 
        status: 'online', 
        uptime: 99.97, 
        message: 'All systems operational' 
      }
    ];

    res.status(200).json({
      success: true,
      data: servers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create MT Account
// @route   POST /api/trading/mt-accounts
// @access  Private
exports.createMTAccount = async (req, res, next) => {
  try {
    const { platform, accountType, leverage, initialDeposit } = req.body;

    // Validate inputs
    if (!platform || !accountType || !leverage || !initialDeposit) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // In a real application, you would integrate with the MT server API
    // For now, we'll create a mock MT account

    const accountId = `MT${platform === 'MT5' ? '5' : '4'}-${Math.floor(100000 + Math.random() * 900000)}`;
    const password = `pass${Math.floor(10000 + Math.random() * 90000)}`;
    const investorPassword = `inv${Math.floor(10000 + Math.random() * 90000)}`;
    
    const serverEnvKey = `VITE_${platform}_${accountType.toUpperCase()}_SERVER`;
    const server = process.env[serverEnvKey] || 'demo.quantisfx.com';

    // Create transaction record for the initial deposit
    await Transaction.create({
      userId: req.user.id,
      type: 'mt_account_deposit',
      amount: initialDeposit,
      status: 'completed',
      reference: `MT-DEP-${Date.now()}`,
      metadata: JSON.stringify({ 
        platform, 
        accountType, 
        accountId,
        server,
        leverage 
      })
    });

    res.status(201).json({
      success: true,
      data: {
        accountId,
        password,
        investorPassword,
        server,
        platform,
        accountType,
        leverage,
        balance: initialDeposit,
        equity: initialDeposit,
        margin: 0,
        freeMargin: initialDeposit,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get MT Accounts
// @route   GET /api/trading/mt-accounts
// @access  Private
exports.getMTAccounts = async (req, res, next) => {
  try {
    // In a real application, you would fetch MT accounts from your database
    // or from the MT server API
    // For now, we'll return mock data

    const mt4DemoAccount = {
      accountId: `MT4-${Math.floor(100000 + Math.random() * 900000)}`,
      server: process.env.VITE_MT4_DEMO_SERVER,
      platform: 'MT4',
      type: 'demo',
      accountType: 'Standard',
      balance: 10000,
      equity: 10000,
      margin: 0,
      freeMargin: 10000,
      leverage: '1:1000',
      isActive: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    };

    const mt5LiveAccount = {
      accountId: `MT5-${Math.floor(100000 + Math.random() * 900000)}`,
      server: process.env.VITE_MT5_LIVE_SERVER,
      platform: 'MT5',
      type: 'live',
      accountType: 'Premium',
      balance: req.user.walletBalance || 5000,
      equity: req.user.walletBalance || 5000,
      margin: (req.user.walletBalance || 5000) * 0.05,
      freeMargin: (req.user.walletBalance || 5000) * 0.95,
      leverage: '1:500',
      isActive: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago
    };

    res.status(200).json({
      success: true,
      data: [mt4DemoAccount, mt5LiveAccount]
    });
  } catch (err) {
    next(err);
  }
};
