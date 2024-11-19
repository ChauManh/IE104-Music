const axios = require('axios');
require('dotenv').config(); // Đọc các biến môi trường

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const { createUserService, loginService, getUserService } = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  if (data) {
    return res.status(201).json(data);
  } else {
    return res.status(400).json({ message: "User already exists or error occurred" });
  }
}

const handleLogin = async (req, res) => {
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
}

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data)
}

const getAccount = async (req, res) => {

  return res.status(200).json(req.user)
}

module.exports = {
  createUser, handleLogin, getUser, getAccount

}