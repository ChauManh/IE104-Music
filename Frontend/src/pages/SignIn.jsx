import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  login,
  signInWithGoogle,
  getWebPlayBackSDKToken,
} from "../services/authApi";
import { assets } from "../assets/assets";
const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData.email, formData.password);

      if (result && result.EC === 0) {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Navigate based on role
        if (result.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.EM || "Login failed");
    }
  };

  // Also handle Google sign-in for admin
  const handleGoogleSignIn = async () => {
    try {
      // First handle Google authentication
      const result = await signInWithGoogle();
      if (result && result.EC === 0) {
        // Store authentication data
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Clear any existing Spotify tokens
        localStorage.removeItem("web_playback_token");

        console.log("Google login successful!");

        // Check if admin user
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
          return;
        }

        try {
          // Redirect to Spotify auth
          window.location.href = "http://localhost:3000/spotify_auth/login";

          // Note: The code below won't execute immediately due to redirect
          const spotifyToken = await getWebPlayBackSDKToken();
          if (spotifyToken) {
            localStorage.setItem(
              "web_playback_token",
              spotifyToken.access_token,
            );
            localStorage.setItem("refresh_token", spotifyToken.refresh_token);
            localStorage.setItem("expires_in", spotifyToken.expires_in);
            console.log("Web Playback SDK Token:", spotifyToken.access_token);
          }
        } catch (spotifyError) {
          console.error("Spotify auth error:", spotifyError);
          alert("Error getting Spotify access. Please try again.");
        }
      }
    } catch (error) {
      console.error("Google signin error:", error);
      alert(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-black px-4 py-8">
      <header className="mb-8">
        <img
          src={assets.soundtify}
          alt="spotify"
          className="h-[50px] w-[50px]"
        />
      </header>

      <section className="flex w-full max-w-[300px] flex-col items-center">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Đăng nhập vào Soundify
        </h1>

        {/* Google Sign In Button */}
        <div className="mb-6 w-full">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center rounded-md border border-gray-500 px-4 py-2 text-white transition duration-150 hover:border-green-300"
          >
            <img
              src="https://accounts.scdn.co/sso/images/new-google-icon.72fd940a229bc94cf9484a3320b3dccb.svg"
              alt="Google"
              className="mr-4"
            />
            Đăng nhập bằng Google
          </button>
        </div>

        {/* Divider */}
        <div className="mb-6 w-full">
          <hr className="w-full border-gray-600" />
        </div>

        {/* Login Form */}
        <div className="w-full text-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block">Tên hoặc email</label>
              <input
                name="email"
                className="w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                type="text"
                placeholder="Tên hoặc email"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block">Mật khẩu</label>
              <input
                name="password"
                className="w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                type="password"
                placeholder="Mật khẩu"
                required
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-[#32c967] py-3 font-bold text-black hover:scale-105 hover:bg-[#3bef7a]"
            >
              Đăng nhập
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="mt-6 text-center text-gray-400">
          <div className="mb-4">
            <Link to="/forgot-password" className="text-white underline">
              Bạn quên mật khẩu ?
            </Link>
          </div>
          <p>
            Không có tài khoản ?
            <Link to="/signup" className="ml-1 text-white underline">
              Đăng ký tài khoản
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
