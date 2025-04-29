
const User = require('../models/User');

// @desc    Get wallet balance
// @route   GET /api/trading/balance
// @access  Private
exports.getWalletBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
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
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { walletBalance: amount } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        depositAmount: amount
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Withdraw funds
// @route   POST /api/trading/withdraw
// @access  Private
exports.withdraw = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid amount' 
      });
    }

    const user = await User.findById(req.user.id);

    // Check if user has enough balance
    if (user.walletBalance < amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insufficient funds' 
      });
    }

    // In a real application, you would initiate a withdrawal process here

    // Update user balance
    user.walletBalance -= amount;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        withdrawAmount: amount
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Transfer funds
// @route   POST /api/trading/transfer
// @access  Private
exports.transfer = async (req, res, next) => {
  try {
    const { toEmail, amount } = req.body;

    if (!toEmail || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide recipient email and valid amount' 
      });
    }

    const sender = await User.findById(req.user.id);

    // Check if sender has enough balance
    if (sender.walletBalance < amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insufficient funds' 
      });
    }

    // Find receiver
    const receiver = await User.findOne({ email: toEmail });

    if (!receiver) {
      return res.status(404).json({ 
        success: false, 
        error: 'Recipient not found' 
      });
    }

    // Update balances
    sender.walletBalance -= amount;
    receiver.walletBalance += amount;

    await sender.save();
    await receiver.save();

    res.status(200).json({
      success: true,
      data: {
        walletBalance: sender.walletBalance,
        transferAmount: amount,
        recipient: toEmail
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get transaction history
// @route   GET /api/trading/history
// @access  Private
exports.getTransactionHistory = async (req, res, next) => {
  try {
    // In a real application, you would query a transactions collection
    // For this example, we'll return a mock response
    
    res.status(200).json({
      success: true,
      data: [
        {
          id: '1',
          type: 'deposit',
          amount: 1000,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          id: '2',
          type: 'withdraw',
          amount: 500,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        }
      ]
    });
  } catch (err) {
    next(err);
  }
};
