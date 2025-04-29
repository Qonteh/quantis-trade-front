
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send verification email with code
 * @param {string} email - Recipient email
 * @param {string} firstName - User's first name
 * @param {string} verificationCode - Verification code
 */
exports.sendVerificationEmail = async (email, firstName, verificationCode) => {
  try {
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Verify Your Quantis FX Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #7C3AED; margin: 0;">Quantis<span style="font-size: 0.6em; vertical-align: super; color: #7C3AED;">FX</span></h1>
          </div>
          
          <h2 style="color: #333;">Hi ${firstName},</h2>
          
          <p style="color: #555; line-height: 1.5;">Thank you for registering with Quantis FX. To complete your registration, please use the verification code below:</p>
          
          <div style="background-color: #f4f0ff; padding: 15px; border-radius: 5px; text-align: center; margin: 25px 0;">
            <h2 style="color: #7C3AED; letter-spacing: 5px; margin: 0;">${verificationCode}</h2>
          </div>
          
          <p style="color: #555; line-height: 1.5;">This code will expire in 30 minutes. If you didn't request this verification, please ignore this email.</p>
          
          <p style="color: #555; line-height: 1.5;">Best regards,<br>The Quantis FX Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #999; text-align: center;">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email after verification
 * @param {string} email - Recipient email
 * @param {string} firstName - User's first name
 */
exports.sendWelcomeEmail = async (email, firstName) => {
  try {
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Welcome to Quantis FX!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #7C3AED; margin: 0;">Quantis<span style="font-size: 0.6em; vertical-align: super; color: #7C3AED;">FX</span></h1>
          </div>
          
          <h2 style="color: #333;">Welcome to Quantis FX, ${firstName}!</h2>
          
          <p style="color: #555; line-height: 1.5;">Your account has been successfully verified and you're now ready to start trading on our platform.</p>
          
          <p style="color: #555; line-height: 1.5;">You can now log in to your account and explore our trading platform, access your demo account with $10,000 in virtual funds, and start learning the ropes of trading.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:8080/login" style="background-color: #7C3AED; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In Now</a>
          </div>
          
          <p style="color: #555; line-height: 1.5;">If you have any questions or need assistance, our support team is available 24/5 to help you.</p>
          
          <p style="color: #555; line-height: 1.5;">Happy Trading!<br>The Quantis FX Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #999; text-align: center;">
            <p>© 2025 Quantis FX. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};
