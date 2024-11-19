import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../util/api";

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
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        alert(result.EM);
        navigate("/");
      } else {
        alert(result.EM || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.EM || "Login failed";
      alert(errorMessage);
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
          Log in to Spotify
        </h1>
        <div className="flex w-[300px] flex-col justify-center gap-4">
          <button className="flex w-full items-center rounded-md border border-gray-500 px-4 py-2 text-white transition duration-150 hover:border-green-300">
            <img
              src="https://accounts.scdn.co/sso/images/new-google-icon.72fd940a229bc94cf9484a3320b3dccb.svg"
              alt="Google"
              className="mr-10"
            />
            Continue with Google
          </button>
          <button className="flex w-full items-center rounded-md border border-gray-500 px-4 py-2 text-white transition duration-150 hover:border-green-300">
            <img
              src="https://accounts.scdn.co/sso/images/new-facebook-icon.eae8e1b6256f7ccf01cf81913254e70b.svg"
              alt=""
              className="mr-8"
            />
            Continue with Facebook
          </button>
          <button className="flex w-full items-center rounded-md border border-gray-500 px-4 py-2 text-white transition duration-150 hover:border-green-300">
            <img
              src="https://accounts.scdn.co/sso/images/new-apple-icon.e356139ea90852da2e60f1ff738f3cbb.svg"
              alt=""
              className="mr-11"
            />
            Continue with Apple
          </button>
          <button className="flex items-center justify-center rounded-md border border-gray-500 py-2 text-white transition duration-150 hover:border-green-300">
            Continue with phone number
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
              <label>Email or username</label>
              <input
                name="email"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                type="text"
                placeholder="Email or username"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label>Password</label>
              <input
                name="password"
                className="mt-2 w-full rounded-md border border-gray-500 bg-transparent p-2 transition duration-200 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300"
                type="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mb-4 w-full rounded-full bg-[#32c967] py-3 font-bold text-black hover:scale-105 hover:bg-[#3bef7a]"
            >
              Log In
            </button>
          </form>
        </div>
        <div className="text-gray-400">
          <div className="mb-4 flex justify-center">
            <a href="#" className="mt-1 text-white underline">
              Forgot password?
            </a>
          </div>
          <p>
            Don't have an account?
            <Link to="/signup" className="ml-1 text-white underline">
              Sign up for Spotify
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
