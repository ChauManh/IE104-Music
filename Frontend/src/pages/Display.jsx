import React, { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import DisplayHome from '../components/DisplayHome';
import DisplaySong from '../components/DisplaySong';
import SearchPage from './SearchPage';
import ArtistPage from './ArtistPage';
import AlbumPage from './AlbumPage';


const Display = () => {
  const displayRef = useRef();

  return (
    <div ref={displayRef} className='rounded-3xl bg-[#121212] text-white overflow-auto lg:w-[100%] lg:ml-0 mt-16'>
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id/tracks" element={<AlbumPage />} />
        <Route path="/track/:id" element={<DisplaySong />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
      </Routes>
    </div>
  );
};

export default Display