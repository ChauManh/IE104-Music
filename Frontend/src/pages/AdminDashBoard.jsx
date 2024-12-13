import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('users');
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            if (activeTab === 'users') {
                const response = await axios.get('http://localhost:3000/admin/users', {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setUsers(response.data.users);
            } else if (activeTab === 'playlists') {
                const response = await axios.get('http://localhost:3000/admin/playlists', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlaylists(response.data.playlists);
            } else if (activeTab === 'stats') {
                const response = await axios.get('http://localhost:3000/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert('Unauthorized access. Please login as admin.');
                // Redirect to login
                window.location.href = '/signin';
            } else {
                alert('Error fetching data');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('access_token');
                await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            }
        }
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            if (selectedUser) {
                // Update user
                await axios.put(
                    `http://localhost:3000/admin/users/${selectedUser._id}`,
                    userForm,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            } else {
                // Create user
                await axios.post(
                    'http://localhost:3000/admin/users',
                    userForm,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            fetchData();
            setShowUserModal(false);
            setSelectedUser(null);
            setUserForm({ name: '', email: '', password: '', role: 'user' });
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.message || 'Error saving user');
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUserForm({
            name: user.name,
            email: user.email,
            role: user.role,
            password: ''
        });
        setShowUserModal(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    const UserFormDialog = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[500px] rounded-lg bg-[#282828] p-6">
                <h2 className="mb-6 text-2xl font-bold text-white">
                    {selectedUser ? 'Edit User' : 'Add New User'}
                </h2>
                <form onSubmit={handleSubmitUser}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm text-[#a7a7a7]">Name</label>
                        <input
                            type="text"
                            value={userForm.name}
                            onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                            className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm text-[#a7a7a7]">Email</label>
                        <input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                            required
                        />
                    </div>
                    {!selectedUser && (
                        <div className="mb-4">
                            <label className="mb-2 block text-sm text-[#a7a7a7]">Password</label>
                            <input
                                type="password"
                                value={userForm.password}
                                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                                required={!selectedUser}
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm text-[#a7a7a7]">Role</label>
                        <select
                            value={userForm.role}
                            onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                            className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowUserModal(false);
                                setSelectedUser(null);
                                setUserForm({ name: '', email: '', password: '', role: 'user' });
                            }}
                            className="rounded-full px-8 py-2 text-white hover:bg-[#ffffff1a]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-full bg-[#1ed760] px-8 py-2 font-semibold text-black hover:scale-105"
                        >
                            {selectedUser ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black p-6 text-white">
            {/* Avatar and dropdown */}
            <div className="absolute right-6 top-6" ref={dropdownRef}>
                <div 
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#282828] p-2 hover:bg-[#3E3E3E]"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <img 
                        src={assets.avatar} 
                        alt="Admin" 
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="pr-2">Admin</span>
                </div>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#282828] py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#3E3E3E]"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>

            <h1 className="mb-6 text-3xl font-bold text-[#1ed760]">Admin Dashboard</h1>
            
            {/* Tabs */}
            <div className="mb-6 flex gap-4">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`rounded-full px-4 py-2 ${
                        activeTab === 'users' ? 'bg-[#1ed760] text-black' : 'bg-[#282828]'
                    }`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('playlists')}
                    className={`rounded-full px-4 py-2 ${
                        activeTab === 'playlists' ? 'bg-[#1ed760] text-black' : 'bg-[#282828]'
                    }`}
                >
                    Playlists
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`rounded-full px-4 py-2 ${
                        activeTab === 'stats' ? 'bg-[#1ed760] text-black' : 'bg-[#282828]'
                    }`}
                >
                    Statistics
                </button>
            </div>

            {/* Content */}
            {activeTab === 'users' && (
                <>
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setShowUserModal(true)}
                            className="rounded-full bg-[#1ed760] px-4 py-2 font-semibold text-black hover:scale-105"
                        >
                            Add New User
                        </button>
                    </div>
                    <div className="rounded-lg bg-[#121212] p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-[#282828]">
                                        <th className="p-4 text-left text-sm font-semibold text-gray-300">Name</th>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-300">Email</th>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-300">Role</th>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr 
                                            key={user._id} 
                                            className="border-b border-[#282828] transition-colors hover:bg-[#282828]"
                                        >
                                            <td className="p-4">{user.name}</td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`rounded-full px-2 py-1 text-xs ${
                                                    user.role === 'admin' ? 'bg-[#1ed760] text-black' : 'bg-[#333] text-white'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="rounded-full bg-[#333] px-3 py-1 text-sm text-white transition-all hover:bg-[#444]"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="rounded-full bg-red-600 px-3 py-1 text-sm text-white transition-all hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Stats Cards */}
            {activeTab === 'stats' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-[#121212] p-6 transition-transform hover:scale-105">
                        <h3 className="mb-2 text-lg text-gray-300">Total Users</h3>
                        <p className="text-2xl font-bold text-[#1ed760]">{stats.users}</p>
                    </div>
                    <div className="rounded-lg bg-[#121212] p-6 transition-transform hover:scale-105">
                        <h3 className="mb-2 text-lg text-gray-300">Total Playlists</h3>
                        <p className="text-2xl font-bold text-[#1ed760]">{stats.playlists}</p>
                    </div>
                    <div className="rounded-lg bg-[#121212] p-6 transition-transform hover:scale-105">
                        <h3 className="mb-2 text-lg text-gray-300">Total Songs</h3>
                        <p className="text-2xl font-bold text-[#1ed760]">{stats.songs}</p>
                    </div>
                </div>
            )}

            {/* Playlists Table */}
            {activeTab === 'playlists' && (
                <div className="rounded-lg bg-[#121212] p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-[#282828]">
                                    <th className="p-4 text-left text-sm font-semibold text-gray-300">Name</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-300">Owner</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-300">Songs</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-300">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playlists.map(playlist => (
                                    <tr key={playlist._id} className="border-b border-[#282828] transition-colors hover:bg-[#282828]">
                                        <td className="p-4">{playlist.name}</td>
                                        <td className="p-4">{playlist.userID?.name}</td>
                                        <td className="p-4">{playlist.songs?.length || 0}</td>
                                        <td className="p-4">
                                            {new Date(playlist.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showUserModal && <UserFormDialog />}
        </div>
    );
};

export default AdminDashboard;