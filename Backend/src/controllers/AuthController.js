const axios = require('axios');
require('dotenv').config(); // Đọc các biến môi trường

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
  }
};

module.exports = AuthController;
