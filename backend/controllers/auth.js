
const User = require('../models/User');
const emailService = require('../services/emailService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, countryCode, phone, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const verificationCodeExpires = new Date(Date.now() + 30 * 60000); // 30 minutes

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      password,
      verificationCode,
      verificationCodeExpires
    });

    // Send email with verification code
    const emailResult = await emailService.sendVerificationEmail(
      email,
      firstName,
      verificationCode
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
    }

    // Log for debugging (can be removed in production)
    console.log(`Verification code for ${email}: ${verificationCode}`);

    // Send token
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide email and password' 
      });
    }

    // Check for user
    const user = await User.findOne({ 
      where: { email } 
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Send token
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { userId, verificationCode } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already verified' 
      });
    }

    // Check if verification code is valid and not expired
    if (
      !user.verificationCode ||
      user.verificationCode !== verificationCode ||
      new Date() > new Date(user.verificationCodeExpires)
    ) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification code' 
      });
    }

    // Update user to verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.firstName);

    return res.status(200).json({ 
      success: true, 
      message: 'Email successfully verified' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already verified' 
      });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const verificationCodeExpires = new Date(Date.now() + 30 * 60000); // 30 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send email with verification code
    const emailResult = await emailService.sendVerificationEmail(
      email,
      user.firstName,
      verificationCode
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send verification email' 
      });
    }

    // Log for debugging (can be removed in production)
    console.log(`New verification code for ${email}: ${verificationCode}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Verification code sent' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verificationCode', 'verificationCodeExpires'] }
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    // Build update object with only allowed fields
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (phone) updateFields.phone = phone;

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    await user.update(updateFields);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const userResponse = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    countryCode: user.countryCode,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    walletBalance: user.walletBalance,
    demoBalance: user.demoBalance,
    createdAt: user.createdAt
  };

  res.status(statusCode).json({
    success: true,
    token,
    data: userResponse
  });
};
