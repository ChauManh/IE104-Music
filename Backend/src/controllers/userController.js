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
      // Xử lý login vào hệ thống
      const userData = await loginService(email, password);
  
      // Spotify OAuth
      const scopes = [
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-private',
        'playlist-read-private',
        'streaming',
      ]; // Các quyền bạn muốn yêu cầu
  
      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
        scopes.join(' ')
      )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  
      // Trả về URL để user nhấp vào hoàn tất Spotify OAuth
      return res.status(200).json({ message: "Login successful", userData, spotifyAuthUrl: authUrl });
    } catch (error) {
      console.error("Error in handleLogin:", error.message);
      return res.status(500).json({ message: "Internal server error" });
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