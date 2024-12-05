import React, { useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import DisplayHome from "../components/DisplayHome";
import DisplaySong from "../components/DisplaySong";
import SearchPage from "./SearchPage";
import ArtistPage from "./ArtistPage";
import AlbumPage from "./AlbumPage";
import PlaylistPage from "./PlaylistPage";

const Display = () => {
  const displayRef = useRef();

  return (
    <div
      ref={displayRef}
      className="mt-16 overflow-auto rounded-3xl bg-[#121212] text-white lg:ml-0 lg:w-[100%]"
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/track/:id" element={<DisplaySong />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
      </Routes>
    </div>
  );
};

export default Display;
