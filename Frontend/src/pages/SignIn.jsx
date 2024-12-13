import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, signInWithGoogle, getWebPlayBackSDKToken } from "../util/api";

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
      console.log("Login response:", result);

      if (result && result.EC === 0) {
        // Store user data in localStorage
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Debug logs
        console.log("User data:", result.user);
        console.log("User role:", result.user.role);

        // Check role and navigate
        if (result.user.role === "admin") {
          console.log("Navigating to admin dashboard...");
          window.location.href = "/admin/dashboard"; // Force full page reload
        } else {
          navigate("/");
        }
      } else {
        alert(result.EM || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.EM || "Login failed";
      alert(errorMessage);
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
                    localStorage.setItem("web_playback_token", spotifyToken.access_token);
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
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-black py-8">
      <header>
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
          alt="spotify"
          className="h-[50px] w-[50px]"
        />
      </header>

      {/* Continue */}

      <section className="h-[33.33%]">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Đăng nhập vào Soundify
        </h1>
        <div className="flex w-[300px] flex-col justify-center gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center rounded-md border border-gray-500 px-4 py-2 text-white transition duration-150 hover:border-green-300"
          >
            <img
              src="https://accounts.scdn.co/sso/images/new-google-icon.72fd940a229bc94cf9484a3320b3dccb.svg"
              alt="Google"
              className="mr-10"
            />
            Đăng nhập bằng Google
          </button>
        </div>

        {/* Line */}

        <div className="m-[16px] flex items-center">
          <hr className="w-full border-gray-600" />
        </div>

        {/* Form */}

        <div className="w-[300px] text-white">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>Tên hoặc email</label>
              <input
                name="email"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                type="text"
                placeholder="Tên hoặc email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label>Mật khẩu</label>
              <input
                name="password"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                type="password"
                placeholder="Mật khẩu"
                required
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mb-4 w-full rounded-full bg-[#32c967] py-3 font-bold text-black hover:scale-105 hover:bg-[#3bef7a]"
            >
              Đăng nhập
            </button>
          </form>
        </div>
        <div className="text-gray-400">
          <div className="mb-4 flex justify-center">
            <Link to="/forgot-password" className="mt-1 text-white underline">
              Bạn quên mật khẩu ?
            </Link>
          </div>
          <p>
            Không có tài khoản ?
            <Link to="/signup" className="ml-1 text-white underline">
              Đăng ký tài khoản mới
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
