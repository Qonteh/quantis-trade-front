
const User = require('../models/User');

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'verificationCode', 'verificationCodeExpires'] }
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Check if user is authorized to view this user
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to access this user' 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Check if user is authorized to update this user
    if (req.user.id != req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this user' 
      });
    }

    await user.update(req.body);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user verification status
// @route   GET /api/users/:id/verification
// @access  Private
exports.getUserVerificationStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // In a real app, you would fetch document verification status from a separate table
    // For now, we'll return a mock response
    const verificationStatus = {
      emailVerified: user.isVerified,
      documentVerified: false, // This would come from your document verification service
      percentage: user.isVerified ? 50 : 0
    };

    res.status(200).json({
      success: true,
      data: verificationStatus
    });
  } catch (err) {
    next(err);
  }
};
