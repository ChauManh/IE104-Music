import React, { useState } from "react";
import { assets } from "../assets/assets";

const SignupForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Email:", email);
  };

  return (
    <div className="flex min-h-screen flex-col items-center text-white">
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
        <form onSubmit={handleSubmit} className="h-min w-full">
          <label htmlFor="" className="font-bold">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-white-600 mb-3 mt-3 w-full rounded-md border-[0.5px] bg-transparent px-4 py-3 text-[18px] text-white focus:outline"
            required
          />
          <a className="font-medium text-[#1ed760] underline" href="#!">
            Use phone number instead
          </a>
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
            <button className="mb-4 flex w-full items-center justify-center rounded-full border-[0.5px] bg-transparent py-3 text-[18px] font-medium text-white hover:border-green-300">
              <img src={assets.google} alt="" className="w-[23px]" />
              <span className="px-12">Sign up with Google</span>
            </button>
            <button className="flex mb-4 w-full items-center justify-center rounded-full border-[0.5px] bg-transparent py-3 text-[18px] font-medium text-white hover:border-green-300">
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
              <a href="/login" className="text-white underline">
                Log in here
              </a>
            </p>
          </div>
        </div>
      </section>
      <footer>

      </footer>
    </div>
  );
};

export default SignupForm;
