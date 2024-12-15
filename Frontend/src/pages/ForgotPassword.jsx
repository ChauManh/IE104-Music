import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword, verifyOtp } from "../services/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Handle email input and send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Error sending OTP");
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      setError("");

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
      // Clear previous error message
      setError("");

      const otpString = otp.join("");
      await verifyOtp(email, otpString);
      setStep(3);
      window.dispatchEvent(new Event("PasswordUpdate"));
    } catch (error) {
      setError("Mã OTP không hợp lệ");
      window.dispatchEvent(new Event("PasswordUpdate"));
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        setError("Mật khẩu không khớp");
        return;
      }

      if (newPassword.length < 6) {
        setError("Mật khẩu phải chứa ít nhất 6 ký tự");
        return;
      }

      const otpString = otp.join("");
      if (otpString.length !== 6) {
        setError("Mã OTP không hợp lệ");
        return;
      }

      // Show loading state
      setError("Đang đặt lại mật khẩu...");

      const response = await resetPassword(email, otpString, newPassword);

      if (response.data.message) {
        setShowSuccessPopup(true);
        setError("");

        // Start countdown
        let timeLeft = 3;
        setCountdown(timeLeft);

        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);

          if (timeLeft === 0) {
            clearInterval(timer);
            navigate("/signin");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError(
        error.response?.data?.message ||
          "Error resetting password. Please try again.",
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
        <h2 className="mb-6 text-2xl font-bold text-white">Đặt lại mật khẩu</h2>

        {error && (
          <div className="mb-4 rounded bg-red-500 p-2 text-white">{error}</div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-white">
                Nhập địa chỉ Email
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
              Gửi mã OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-white">
                Nhập mã OTP được gửi đến địa chỉ Email của bạn
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
              Xác nhận
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-white">
                Mật khẩu mới
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
                Xác nhận mật khẩu mới
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
              Đặt lại mật khẩu
            </button>
          </form>
        )}
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50 rounded-lg bg-[#282828] p-6 text-center">
            <h3 className="mb-4 text-xl font-bold text-white">
              Đặt lại mật khẩu thành công!
            </h3>
            <p className="text-gray-300">
              Bạn sẽ được chuyển hướng đến trang đăng nhập sau {countdown}{" "}
              giây...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
