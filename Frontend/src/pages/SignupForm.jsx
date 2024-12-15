import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { createUser, signInWithGoogle, login } from "../services/authApi";
import axios from "axios";

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    verifyPassword: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  };

  const validateForm = () => {
    if (
      !form.email ||
      !form.username ||
      !form.password ||
      !form.verifyPassword
    ) {
      setIsError(true);
      setNotificationMessage("Vui lòng điền đầy đủ thông tin");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      return false;
    }

    if (form.password.length < 6) {
      setIsError(true);
      setNotificationMessage("Mật khẩu phải có ít nhất 6 ký tự");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (form.password !== form.verifyPassword) {
      setIsError(true);
      setNotificationMessage("Mật khẩu không khớp");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      return;
    }

    try {
      const res = await createUser(form.username, form.email, form.password);

      if (res.data.EC === 0) {
        // Login immediately after signup to get access token
        const loginResponse = await login(form.email, form.password);

        if (loginResponse.data.EC === 0) {
          const token = loginResponse.data.access_token;
          localStorage.setItem("access_token", token);
          localStorage.setItem("user", JSON.stringify(loginResponse.data.user));

          try {
            // Create liked songs playlist immediately after signup
            await axios.post(
              "http://localhost:3000/user/create_playlist",
              {
                name: "Bài hát đã thích",
                type: "playlist",
                description: "Những bài hát bạn yêu thích",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            // Show success notification
            setIsError(false);
            setNotificationMessage("Đăng ký thành công");
            setShowNotification(true);

            // Trigger sidebar refresh
            window.dispatchEvent(new Event("playlistsUpdated"));

            setTimeout(() => {
              setShowNotification(false);
              navigate("/signin");
            }, 2000);
          } catch (error) {
            console.error("Error creating liked songs playlist:", error);
          }
        }
      } else if (res.data.EC === 2) {
        setIsError(true);
        setNotificationMessage("Email đã được sử dụng");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      } else if (res.data.EC === 3) {
        setIsError(true);
        setNotificationMessage("Tên tài khoản đã tồn tại");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }
    } catch (err) {
      setIsError(true);
      setNotificationMessage(
        err.response?.data?.EM ||
          err.response?.data?.message ||
          "Đăng ký thất bại",
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithGoogle();
      if (result && result.EC === 0) {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setIsError(false);
        setNotificationMessage("Đăng ký thành công");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setIsError(true);
      setNotificationMessage(error.message || "Đăng ký bằng Google thất bại");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const Notification = ({ message, isError }) => (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform">
      <div
        className={`rounded-full ${isError ? "bg-red-500" : "bg-[#1ed760]"} px-4 py-2 text-center text-sm font-medium text-white shadow-lg`}
      >
        <span>{message}</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-black py-8">
      <header>
        <img
          src={assets.soundtify}
          alt="spotify"
          className="h-[50px] w-[50px]"
        />
      </header>

      <section className="flex w-full flex-col items-center">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Đăng ký tài khoản Soundify
        </h1>

        <div className="flex w-[300px] flex-col items-center justify-center gap-4">
          <button
            onClick={handleGoogleSignUp}
            className="flex w-full items-center rounded-md border border-gray-500 px-4 py-2 text-white transition duration-150 hover:border-green-300"
          >
            <img
              src="https://accounts.scdn.co/sso/images/new-google-icon.72fd940a229bc94cf9484a3320b3dccb.svg"
              alt="Google"
              className="mr-10"
            />
            Đăng ký bằng Google
          </button>
        </div>

        <div className="m-[16px] flex w-[300px] items-center">
          <hr className="w-full border-gray-600" />
        </div>

        <div className="w-[300px] text-white">
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block">Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@domain.com"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                onChange={onUpdateField}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block">Tên tài khoản</label>
              <input
                type="text"
                name="username"
                placeholder="Tên tài khoản"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                onChange={onUpdateField}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block">Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                onChange={onUpdateField}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block">Nhập lại mật khẩu</label>
              <input
                type="password"
                name="verifyPassword"
                placeholder="Nhập lại mật khẩu"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                onChange={onUpdateField}
                required
              />
            </div>

            <button
              type="submit"
              className="mb-4 w-full rounded-full bg-[#32c967] py-3 font-bold text-black hover:scale-105 hover:bg-[#3bef7a]"
            >
              Đăng ký
            </button>
          </form>
        </div>

        <div className="text-center text-gray-400">
          <p>
            Đã có tài khoản?{" "}
            <Link to="/signin" className="text-white underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>

      {showNotification && (
        <Notification message={notificationMessage} isError={isError} />
      )}
    </div>
  );
};

export default SignupForm;
