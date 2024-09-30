import React from 'react';
import { assets } from '../assets/assets'; // Import assets

const TopNavigation = () => {
  return (
    <div className="flex justify-between items-center h-16 fixed top-0 right-0 bg-black w-4/5">
      <div className="flex space-x-4 h-[80%] mt-1.5">
        <NavItem icon={assets.home_icon} label="Home" />
        <NavItem icon={assets.search_icon} label="Discover" />
        <SearchBar />
      </div>
      <RightMenu />
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center space-x-2 hover:bg-[#1f1f1f] h-[80%] rounded-md cursor-pointer p-0.5 w-36">
    <img src={icon} alt={label} className="h-6 w-6 ml-2.5 mr-1" />
    <span className="text-white">{label}</span>
  </div>
);

const SearchBar = () => (
  <div className="flex items-center space-x-2 h-[80%] rounded-md p-0.5 w-96">
    <button className="h-[95%]">
      <img src={assets.search_icon} alt="Search" className="h-6 w-6 ml-2.5 mr-1" />
    </button>
    <input
      type="text"
      placeholder="Search..."
      className="bg-transparent outline-none text-white placeholder-gray-400 w-full pl-2"
    />
  </div>
);

const RightMenu = () => (
  <div className="flex space-x-4 pr-3">
    <MenuButton icon={assets.bell_icon} />
    <MenuButton icon={assets.stack_icon} />
    <MenuButton icon={assets.speaker_icon} />
    <Avatar />
  </div>
);

const MenuButton = ({ icon }) => (
  <button className="flex items-center space-x-3 text-white">
    <img src={icon} alt="Menu Icon" className="h-6 w-6 hover:opacity-50" />
  </button>
);

const Avatar = () => (
  <button className="avatar w-8 h-8 overflow-hidden rounded-full border border-white hover:bg-gray-700">
    <img
      src={assets.facebook} // Đổi avatar bằng một ảnh trong assets
      alt="Avatar"
      className="h-full w-full object-cover hover:scale-110"
    />
  </button>
);

export default TopNavigation;
