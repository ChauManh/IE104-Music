const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken'); // Add this
const User = require('../models/users'); // Add this
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Add this

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const { createUserService, loginService, getUserService } = require("../services/authService");

const AuthController = {
  // Tạo người dùng mới

  async createUser(req, res) {
    const { name, email, password } = req.body;

    try {
      const data = await createUserService(name, email, password);
      if (data) {
        return res.status(201).json(data);
      } else {
        return res.status(400).json({ message: "User already exists or error occurred" });
      }
    } catch (error) {
      console.error("Error in createUser:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Đăng nhập
  async handleLogin(req, res) {
    const { email, password } = req.body;

    try {
      const userData = await loginService(email, password);

      if (userData.EC === 0) {
        return res.status(200).json(userData);
      } else {
        return res.status(401).json({
          EC: userData.EC,
          EM: userData.EM
        });
      }
    } catch (error) {
      console.error("Error in handleLogin:", error);
      return res.status(500).json({
        EC: 3,
        EM: "Internal server error"
      });
    }
  },

  // Lấy thông tin người dùng
  async getUser(req, res) {
    try {
      const data = await getUserService();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in getUser:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Lấy thông tin tài khoản của người dùng hiện tại (đã được xác thực)
  async getAccount(req, res) {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      console.error("Error in getAccount:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  async handleGoogleAuth(req, res) {
    try {
      const { email, name, googleId } = req.body;

      if (!email || !name || !googleId) {
        return res.status(400).json({
          EC: 1,
          EM: "Missing required Google auth data"
        });
      }

      let user = await User.findOne({ email });

      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          email,
          name,
          googleId,
          password: null, // Google auth users don't need password
          role: 'user'  // Set default role for Google auth users
        });
        await user.save();
      } else {
        // Update existing user's googleId if needed
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
      }

      const payload = {
        id: user._id,
        email: user.email,
        name: user.name
      };

      const access_token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        EC: 0,
        EM: "Google authentication successful",
        access_token,
        user: payload
      });

    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(500).json({
        EC: 3,
        EM: "Internal server error",
        error: error.message
      });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP and expiry
      user.resetPasswordOtp = otp;
      user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
      await user.save();

      // Send email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`
      });

      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending OTP' });
    }
  },

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying OTP' });
    }
  },

  async resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        console.log('Reset password attempt:', { email, otp }); // Debug log

        // Validate inputs
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ 
                message: 'Email, OTP and new password are required' 
            });
        }

        // Find user with valid OTP
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid or expired OTP. Please request a new one.' 
            });
        }

        try {
            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Update user password and clear OTP fields
            user.password = hashedPassword;
            user.resetPasswordOtp = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ 
                message: 'Password reset successfully' 
            });
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ 
                message: 'Error updating password' 
            });
        }
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            message: 'Error resetting password',
            error: error.message 
        });
    }
  }
};

module.exports = AuthController;
