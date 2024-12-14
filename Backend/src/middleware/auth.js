require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    // Remove /update_avatar from white list if it's there
    const white_lists = ["auth/register", "auth/login"];
    
    if (white_lists.includes(req.originalUrl)) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role // Include role
                }
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token expired or invalid"
                })
            }
        } else {
            return res.status(401).json({
                message: "No access token provided or token expired"
            })
        }
    }
}

module.exports = auth;