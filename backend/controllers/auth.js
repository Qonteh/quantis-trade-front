
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, countryCode, phone, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Generate verification code
    const verificationCode = {
      code: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit code
      expiresAt: new Date(Date.now() + 30 * 60000) // 30 minutes
    };

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      password,
      verificationCode
    });

    // In a real-world application, you would send an email with the verification code here
    console.log(`Verification code for ${email}: ${verificationCode.code}`);

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
    const user = await User.findOne({ email }).select('+password');

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

    const user = await User.findById(userId);

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
      user.verificationCode.code !== verificationCode ||
      new Date() > new Date(user.verificationCode.expiresAt)
    ) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification code' 
      });
    }

    // Update user to verified
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

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

    const user = await User.findOne({ email });

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
    const verificationCode = {
      code: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit code
      expiresAt: new Date(Date.now() + 30 * 60000) // 30 minutes
    };

    user.verificationCode = verificationCode;
    await user.save();

    // In a real-world application, you would send an email with the verification code here
    console.log(`New verification code for ${email}: ${verificationCode.code}`);

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
    const user = await User.findById(req.user.id);
    
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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

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

    const user = await User.findById(req.user.id).select('+password');

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

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .json({
      success: true,
      token,
      data: user
    });
};
