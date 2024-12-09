import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DisplayHome from "../components/DisplayHome";
import DisplaySong from "../components/DisplaySong";
import SearchPage from "./SearchPage";
import ArtistPage from "./ArtistPage";
import AlbumPage from "./AlbumPage";
import PlaylistPage from "./PlaylistPage";
import { refreshApp } from '../Layout/Components/sidebar';

const Display = () => {
  const displayRef = useRef();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const handleAppUpdate = () => {
      setRefresh(prev => !prev); // Toggle refresh state to force re-render
    };

    window.addEventListener('appStateUpdated', handleAppUpdate);

    return () => {
      window.removeEventListener('appStateUpdated', handleAppUpdate);
    };
  }, []);

  return (
    <div
      ref={displayRef}
      className="mt-16 overflow-auto rounded-lg bg-[#121212] text-white lg:ml-0 lg:w-[100%]"
    >
      <Routes>
        <Route path="/" element={<DisplayHome key={refresh} />} />
        <Route path="/album/:id" element={<AlbumPage key={refresh} />} />
        <Route path="/playlist/:id" element={<PlaylistPage key={refresh} />} />
        <Route path="/track/:id" element={<DisplaySong key={refresh} />} />
        <Route path="/search/:query" element={<SearchPage key={refresh} />} />
        <Route path="/artist/:id" element={<ArtistPage key={refresh} />} />
      </Routes>
    </div>
  );
};

export default Display;
