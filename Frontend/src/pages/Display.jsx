import React, { useEffect, useRef, useState, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import DisplayHome from "../components/DisplayHome";
import SearchPage from "./SearchPage";
import ArtistPage from "./ArtistPage";
import AlbumPage from "./AlbumPage";
import PlaylistPage from "./PlaylistPage";
import LoginRequiredPopup from '../components/LoginRequiredPopup';
import ProfilePage from "./ProfilePage";
import { PlayerContext } from '../context/PlayerContext';

const Display = () => {
  const displayRef = useRef();
  const [refresh, setRefresh] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  const { isDeviceReady } = useContext(PlayerContext);

  useEffect(() => {
    const handleAppUpdate = () => {
      setRefresh(prev => !prev); // Toggle refresh state to force re-render
    };

    window.addEventListener('appStateUpdated', handleAppUpdate);

    return () => {
      window.removeEventListener('appStateUpdated', handleAppUpdate);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const web_playback_token = localStorage.getItem('web_playback_token');
    // const expires_in = localStorage.getItem('expires_in');
    if (!token && !web_playback_token) {
      setShowLoginPopup(true);
    }
  }, []);

  useEffect(() => {
  }, [isDeviceReady]);

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    navigate('/signin');
  };

  if (!showLoginPopup && !isDeviceReady) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-white"></div>
        <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div
      ref={displayRef}
      className="mt-16 overflow-auto rounded-lg bg-[#121212] text-white lg:ml-0 lg:w-[100%]"
    >
      <Routes>
        <Route path="/" element={<DisplayHome key={refresh} />} />
        <Route path="/album/:id" element={<AlbumPage key={refresh} />} />
        <Route path="/playlist/:id" element={<PlaylistPage key={refresh} />} />
        {/* <Route path="/track/:id" element={<DisplaySong key={refresh} />} /> */}
        <Route path="/search/:query" element={<SearchPage key={refresh} />} />
        <Route path="/artist/:id" element={<ArtistPage key={refresh} />} />
        <Route path="/profile" element={<ProfilePage key={refresh} />} />
      </Routes>
      {showLoginPopup && (
        <LoginRequiredPopup onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default Display;
