import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Handle email input and send OTP
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/auth/forgot-password', { email });
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || 'Error sending OTP');
        }
    };

    // Handle OTP input
    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if value is entered
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    // Handle OTP verification
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const otpString = otp.join('');
            await axios.post('http://localhost:3000/auth/verify-otp', {
                email,
                otp: otpString
            });
            setStep(3);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid OTP');
        }
    };

    // Handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            // Clear previous errors
            setError('');

            // Validate passwords
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (newPassword.length < 6) {
                setError('Password must be at least 6 characters long');
                return;
            }

            const otpString = otp.join('');
            if (otpString.length !== 6) {
                setError('Invalid OTP');
                return;
            }

            // Show loading state
            setError('Processing...');

            const response = await axios.post('http://localhost:3000/auth/reset-password', {
                email,
                otp: otpString,
                newPassword
            });

            if (response.data.message) {
                alert('Password reset successfully');
                navigate('/signin');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError(
                error.response?.data?.message || 
                'Error resetting password. Please try again.'
            );
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-black py-8">
            <header>
                <img
                    src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
                    alt="spotify"
                    className="h-[50px] w-[50px]"
                />
            </header>

            <div className="w-[400px] rounded-lg bg-[#282828] p-8">
                <h2 className="mb-6 text-2xl font-bold text-white">Reset Password</h2>

                {error && (
                    <div className="mb-4 rounded bg-red-500 p-2 text-white">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm text-white">
                                Enter your email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#1ed760] px-4 py-2 font-semibold text-black hover:scale-105"
                        >
                            Send OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm text-white">
                                Enter 6-digit OTP sent to your email
                            </label>
                            <div className="flex gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        className="h-12 w-12 rounded bg-[#3e3e3e] text-center text-white focus:outline-none"
                                        required
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#1ed760] px-4 py-2 font-semibold text-black hover:scale-105"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm text-white">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm text-white">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#1ed760] px-4 py-2 font-semibold text-black hover:scale-105"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;