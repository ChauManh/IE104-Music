const User = require('../models/users');

const adminAuth = async (req, res, next) => {
    try {
        // Check if user exists in request (set by auth middleware)
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Authentication required' 
            });
        }

        // Get fresh user data from database to ensure role is current
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Access denied. Admin privileges required.' 
            });
        }
        
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({ message: 'Admin authorization failed' });
    }
};

module.exports = adminAuth;