import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery;
  const currentPath = location.pathname.split('/')[2] || 'all';

  const handleFilterClick = (filter) => {
    // Keep search results while changing filter
    navigate(`/search/${encodeURIComponent(searchQuery)}/${filter}`, {
      state: location.state
    });
  };

  return (
    <div className='flex items-center px-6 gap-2 mt-4 rounded-2xl'>
      <p 
        onClick={() => handleFilterClick('all')}
        className={`px-4 py-1 rounded-2xl cursor-pointer transition-colors ${
          currentPath === 'all' ? 'bg-white text-black' : 'bg-black text-white hover:bg-zinc-900'
        }`}
      >
        Tất cả
      </p>
      <p 
        onClick={() => handleFilterClick('tracks')}
        className={`px-4 py-1 rounded-2xl cursor-pointer transition-colors ${
          currentPath === 'tracks' ? 'bg-white text-black' : 'bg-black text-white hover:bg-zinc-900'
        }`}
      >
        Nhạc
      </p>
      <p 
        onClick={() => handleFilterClick('albums')}
        className={`px-4 py-1 rounded-2xl cursor-pointer transition-colors ${
          currentPath === 'albums' ? 'bg-white text-black' : 'bg-black text-white hover:bg-zinc-900'
        }`}
      >
        Album
      </p>
      <p 
        onClick={() => handleFilterClick('artists')}
        className={`px-4 py-1 rounded-2xl cursor-pointer transition-colors ${
          currentPath === 'artists' ? 'bg-white text-black' : 'bg-black text-white hover:bg-zinc-900'
        }`}
      >
        Nghệ sĩ
      </p>
    </div>
  );
};

export default Navbar;