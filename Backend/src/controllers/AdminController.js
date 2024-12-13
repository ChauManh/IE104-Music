const User = require('../models/users');
const Playlist = require('../models/playlist');
const Song = require('../models/song');

const AdminController = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, role } = req.body;

            const user = await User.findByIdAndUpdate(
                id,
                { name, email, role },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User updated successfully', user });
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByIdAndDelete(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Also delete user's playlists
            await Playlist.deleteMany({ userID: id });

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    },

    async getStats(req, res) {
        try {
            const stats = {
                users: await User.countDocuments(),
                playlists: await Playlist.countDocuments(),
                songs: await Song.countDocuments()
            };
            res.status(200).json({ stats });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stats', error: error.message });
        }
    },

    async getAllPlaylists(req, res) {
        try {
            const playlists = await Playlist.find().populate('userID', 'name email');
            res.status(200).json({ playlists });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching playlists', error: error.message });
        }
    },

    async deletePlaylist(req, res) {
        try {
            const { id } = req.params;
            const playlist = await Playlist.findByIdAndDelete(id);

            if (!playlist) {
                return res.status(404).json({ message: 'Playlist not found' });
            }

            res.status(200).json({ message: 'Playlist deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting playlist', error: error.message });
        }
    },

    async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const user = new User({
                name,
                email,
                password: hashedPassword,
                role
            });
            
            await user.save();
            
            const userResponse = await User.findById(user._id).select('-password');
            res.status(201).json({ message: 'User created successfully', user: userResponse });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }
};

module.exports = AdminController;