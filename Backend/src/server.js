const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors'); // Cho phép gọi từ frontend
const db = require('./config/db/db')
const route = require('./routes/index')
const userApi = require('./routes/userApi'); // Ensure the user API routes are correctly imported

// Kết nối DB
db.connect();

const app = express();
const port = process.env.PORT || 3000; // PORT từ biến môi trường

// Middleware
app.use(cors()); // Đảm bảo Frontend có thể gọi API này
app.use(morgan('combined')); // HTTP Logger
app.use(express.static(path.join(__dirname, 'public'))); // Static files
app.use(express.urlencoded({ extended: true })); // Xử lý form
app.use(express.json()); // Xử lý JSON

// Route gốc để kiểm tra
app.get('/', (req, res) => {
  res.send('Server is running! Welcome to Spotify API Backend.');
});

// Gọi route với app
app.use('/v1/api', userApi); // Ensure the correct base path for the API
route(app); // Cấu hình các route

// Khởi động server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
