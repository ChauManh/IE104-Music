require("dotenv").config();

const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        // Check if email exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return {
                EC: 2,
                EM: 'Email already exists'
            };
        }

        // Check if username exists
        const existingUsername = await User.findOne({ name });
        if (existingUsername) {
            return {
                EC: 3,
                EM: 'Username already exists'
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        return {
            EC: 0,
            EM: 'User created successfully'
        };
    } catch (err) {
        return {
            EC: 1,
            EM: 'Error occurred during sign-up',
            details: err.message
        };
    }
}

const loginService = async (emailOrUsername, password) => {
    try {
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { name: emailOrUsername }
            ]
        });

        if (!user) {
            return {
                EC: 1,
                EM: "User not found"
            }
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return {
                EC: 2,
                EM: "Invalid password"
            }
        }

        // Include role in token payload
        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }

        const access_token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            EC: 0,
            EM: "Login successful",
            access_token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    } catch (error) {
        console.error("Login service error:", error);
        throw error;
    }
}

const getUserService = async () => {
    try {

        let result = await User.find({}).select("-password");
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}
module.exports = {
    createUserService, loginService, getUserService
}