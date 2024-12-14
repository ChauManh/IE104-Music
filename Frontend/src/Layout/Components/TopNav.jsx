import React, { useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { useNavigate, Link } from "react-router-dom";
import Search from "../../components/Search";
import axios from "axios";

const TopNav = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [userGmail, setUserGmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Fetch fresh user data from server
        const response = await axios.get('http://localhost:3000/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data.user;
        setUserData(user);
        setUserName(user.name);
        setUserGmail(user.email);
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Initial fetch
    fetchUserData();

    // Listen for avatar updates
    const handleAvatarUpdate = () => {
      fetchUserData();
    };
    window.addEventListener('avatarUpdated', handleAvatarUpdate);

    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);

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

  const handleLogout = () => {
    window.location.href = "/signin";
    localStorage.clear();
  }

  return (
    <div className="fixed left-0 top-0 z-10 flex w-full items-center justify-between bg-black p-2 text-white">
      <div className="cursor-pointer pl-3 flex items-center space-x-2">
        <a href="http://localhost:5173/">
          <img className="w-10" src={assets.soundtify} alt="Logo" />
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
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="rounded-full bg-black p-2 hover:bg-[#282828] transition-colors"
        >
          <img 
            src={userData?.avatar || assets.avatar} 
            alt="Profile" 
            className="h-8 w-8 rounded-full object-cover"
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-12 w-48 rounded-md bg-[#282828] py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all">
            <div className="flex items-center gap-3 px-4 py-3">
              <img 
                src={userData?.avatar || assets.avatar}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-white">{userName}</p>
              </div>
            </div>
            <div className="border-t border-gray-700">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3E3E3E]"
                onClick={() => setIsDropdownOpen(false)}
              >
                Trang cá nhân
              </Link>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3E3E3E]"
              >
                Cài đặt
              </a>
            </div>
            <div className="border-t border-gray-700">
              <Link
                to="/signin"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3E3E3E]"
                onClick={handleLogout}
              >
                Đăng xuất
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNav;
