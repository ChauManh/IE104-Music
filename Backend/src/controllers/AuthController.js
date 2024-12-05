const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken'); // Add this
const User = require('../models/users'); // Add this

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
          password: null // Google auth users don't need password
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
  }
};

module.exports = AuthController;
