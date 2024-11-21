import React, { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DisplayHome from '../components/DisplayHome';
import DisplayAlbum from '../components/DisplayAlbum';
import DisplaySong from '../components/DisplaySong';
import SearchPage from './SearchPage'; // Add this import

import { albumsData } from '../assets/assets'

const Display = () => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");

  const albumId = isAlbum ? location.pathname.slice(-1) : "";
  const bgColor = isAlbum ? albumsData[Number(albumId)].bgColor : "";

  useEffect(() => {
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`;
    } else {
      displayRef.current.style.background = '#121212';
    }
  }, [isAlbum, bgColor]);

  return (
    <div ref={displayRef} className='px-6 rounded-3xl bg-[#121212] text-white overflow-auto lg:w-[100%] lg:ml-0 mt-16'>
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/track/:id" element={<DisplaySong />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
};

export default Display