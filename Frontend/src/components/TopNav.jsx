import React from "react";
import { assets } from "../assets/assets";

const TopNav = () => {
  return (
    <div className="fixed left-0 top-0 flex w-full items-center justify-between bg-black p-2 text-white">
      <div className="cursor-pointer pl-3">
        <a href="http://localhost:5173/">
          <img className="w-10" src={assets.spotify_logo} alt="Logo" />
        </a>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex cursor-pointer items-center gap-3 rounded-full bg-zinc-800 p-3 transition-transform duration-300 hover:scale-110">
          <img className="w-6" src={assets.home_icon} alt="Home" />
        </div>
        <div className="hover: relative">
          <img
            src={assets.search_icon}
            alt="Search"
            className="absolute left-3 top-3 w-6 cursor-pointer"
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="h-12 w-96 rounded-l-full rounded-r-full bg-zinc-800 pl-12 text-white hover:bg-zinc-700"
          />
        </div>
      </div>

      <div className="flex cursor-pointer items-center rounded-full bg-zinc-800 p-2 transition-transform duration-300 hover:scale-110">
        <img className="w-8 rounded-full" src={assets.avatar} alt="Home" />
      </div>
    </div>
  );
};

export default TopNav;
