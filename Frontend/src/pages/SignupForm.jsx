import React, { useState } from "react";
import { useNavigate, Link, BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Add this import
import { assets } from "../assets/assets";
import { createUser, signInWithGoogle } from "../util/api";

const SignupForm = () => {
  const navigate = useNavigate(); // Add navigate hook
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
    <div className="flex min-h-screen flex-col items-center text-white bg-black">
      <header>
        <img
          src={assets.spotify_logo_white}
          alt=""
          className="mb-[10px] mt-[40px] h-[50px] w-[50px]"
        />
      </header>
      <section className="w-[338px]">
        <header>
          <h1 className="mb-[40px] w-full text-center text-3xl text-[50px] font-bold leading-snug">
            Sign up to start listening
          </h1>
        </header>
        <form onSubmit={handleSignUp} className="h-min w-full">
          <label htmlFor="email" className="font-bold">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@domain.com"
            name="email"
            onChange={onUpdateField}
            className="focus:ring-white-600 mb-3 mt-3 w-full rounded-md border-[0.5px] bg-transparent px-4 py-3 text-[18px] text-white focus:outline"
            required
          />
          <input
            id="username"
            type="text"
            name="username"
            placeholder="username"
            className="focus:ring-white-600 mb-3 mt-3 w-full rounded-md border-[0.5px] bg-transparent px-4 py-3 text-[18px] text-white focus:outline"
            required
            onChange={onUpdateField}
          />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
            className="focus:ring-white-600 mb-3 mt-3 w-full rounded-md border-[0.5px] bg-transparent px-4 py-3 text-[18px] text-white focus:outline"
            required
            onChange={onUpdateField}
          />
          <input
            id="verifyPassword"
            type="password"
            name="verifyPassword"
            placeholder="Confirm password"
            className="focus:ring-white-600 mb-3 mt-3 w-full rounded-md border-[0.5px] bg-transparent px-4 py-3 text-[18px] text-white focus:outline"
            required
            onChange={onUpdateField}
          />
          <button
            type="submit"
            className="mb-6 mt-4 w-full rounded-full bg-green-500 py-4 text-center text-[18px] font-medium text-black hover:bg-green-600"
          >
            Next
          </button>
        </form>
        <div className="mt-[18px]">
          <div>
            <div className="before relative mb-6 text-center font-medium text-white before:absolute before:-end-4 before:block before:h-[1px] before:w-[360px] before:bg-[#818181]">
              or
            </div>
          </div>
          <div className="flex w-full flex-col justify-center gap-1">
            <button 
              onClick={handleGoogleSignUp}
              className="mb-4 flex w-full items-center justify-center rounded-full border-[0.5px] bg-transparent py-3 text-[18px] font-medium text-white hover:border-green-300"
            >
              <img src={assets.google} alt="" className="w-[23px]" />
              <span className="px-12">Sign up with Google</span>
            </button>
            <button className="mb-4 flex w-full items-center justify-center rounded-full border-[0.5px] bg-transparent py-3 text-[18px] font-medium text-white hover:border-green-300">
              <img src={assets.facebook} alt="" className="w-[23px]" />
              <span className="px-12">Sign up with Google</span>
            </button>
            <button className="flex w-full items-center justify-center rounded-full border-[0.5px] bg-transparent py-3 text-[18px] font-medium text-white hover:border-green-300">
              <img src={assets.apple_svg} alt="" className="w-[23px]" />
              <span className="px-12">Sign up with Google</span>
            </button>
          </div>
          <div className="flex justify-center">
            <p className="mt-6 text-gray-400">
              Already have an account?{" "}
              <Link to="/signin" className="text-white underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupForm;
