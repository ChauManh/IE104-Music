import React, { useState, useRef } from "react";
import { assets } from "../../assets/assets";
import { useNavigate, Link } from "react-router-dom";
import Search from "../../components/Search";
import axios from "axios";

const TopNav = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [query, setQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get(`http://localhost:3000/search`, {
        params: {
          q: query,
          type: "track,album,artist,playlist",
        },
      });

      navigate(`/search/${encodeURIComponent(query)}`, { 
        state: { 
          searchResults: {
            tracks: { items: response.data.tracks?.items || [] },
            albums: { items: response.data.albums?.items || [] },
            artists: { items: response.data.artists?.items || [] },
            playlists: { items: response.data.playlists?.items || [] }
          },
          searchQuery: query,
        },
      });
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="fixed left-0 top-0 z-10 flex w-full items-center justify-between bg-black p-2 text-white">
      <div className="cursor-pointer pl-3 flex items-center space-x-2">
        <a href="http://localhost:5173/">
          <img className="w-10" src={assets.spotify_logo} alt="Logo" />
        </a>
        <img onClick={()=>navigate(-1)} className="w-5 cursor-pointer transition-transform duration-300 hover:scale-110" src={assets.arrow_left} alt="Arrow Left" />
        <img onClick={()=>navigate(1)} className="w-5 cursor-pointer transition-transform duration-300 hover:scale-110" src={assets.arrow_right} alt="Arrow Right" />
      </div>


      <div className="flex items-center gap-4">
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-3 rounded-full bg-zinc-800 p-3 transition-transform duration-300 hover:scale-110"
        >
          <img className="w-6" src={assets.home_icon} alt="Home" />
        </div>
        <div className="hover: relative">
          <img
            src={assets.search_icon}
            alt="Search"
            className="absolute left-3 top-3 w-6 cursor-pointer"
          />
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bạn muốn phát nội dung gì?"
              className="h-12 w-96 rounded-full bg-zinc-800 pl-12 text-white hover:bg-zinc-700 focus:outline-none"
            />
          </form>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center rounded-full bg-zinc-800 p-2 transition-transform duration-300 hover:scale-110"
        >
          <img className="w-8 rounded-full" src={assets.avatar} alt="Home" />
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 top-12 w-48 rounded-md bg-[#282828] py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all">
            <div className="px-4 py-3">
              <p className="text-sm text-white">Username</p>
              <p className="truncate text-sm text-gray-400">user@email.com</p>
            </div>
            <div className="border-t border-gray-700">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3E3E3E]"
              >
                Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3E3E3E]"
              >
                Settings
              </a>
            </div>
            <div className="border-t border-gray-700">
              <Link
                to="/signin"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3E3E3E]"
                onClick={handleLogout}
              >
                Log out
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNav;
