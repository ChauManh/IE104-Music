import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { createUser, signInWithGoogle } from "../util/api";

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    // validate;
    if (form.password !== form.verifyPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await createUser(form.username, form.email, form.password);
      alert(res.data.EM);
      navigate('/'); // Navigate to home after successful signup
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message);
      return;
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithGoogle();
      if (result && result.EC === 0) {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-black py-8">
      <header>
        <img
          src={assets.spotify_logo_white}
          alt="spotify"
          className="h-[50px] w-[50px]"
        />
      </header>

      <section className="flex flex-col items-center w-full">
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

        <div className="m-[16px] flex items-center w-[300px]">
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

        <div className="text-gray-400 text-center">
          <p>
            Đã có tài khoản?{" "}
            <Link to="/signin" className="text-white underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignupForm;
