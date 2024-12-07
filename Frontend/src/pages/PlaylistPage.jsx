import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets';
import ColorThief from 'colorthief';
import axios from 'axios';

const PlaylistPage = () => {
  const { id } = useParams();
  const { albumTracks, playWithUri } = useContext(PlayerContext);
  const [dominantColor, setDominantColor] = useState("#333333");
  const [secondaryColor, setSecondaryColor] = useState("#121212");
  const [playlistData, setPlaylistData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await axios.get(`http://localhost:3000/user/playlist/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { playlist } = response.data;
        setPlaylistData(playlist);

        // Get user data from playlist.userID
        if (playlist.userID) {
          setUserData({
            name: playlist.userID.name,
            email: playlist.userID.email
          });
        }

        // Get dominant color from playlist thumbnail
        if (playlist.thumbnail) {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = playlist.thumbnail || assets.plus_icon;
          img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            setDominantColor(`rgb(${dominantColor.join(",")})`);
            setSecondaryColor(`rgba(${dominantColor.join(",")}, 0.5)`);
          };
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setIsLoading(false);
      }
    };

    fetchPlaylistData();
  }, [id]);



  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full bg-[#121212] text-white">
      {/* Header with gradient background */}
      <div 
        className="flex h-[240px] items-end p-4 md:h-[340px] md:p-8"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 0%, ${secondaryColor} 100%)`,
          filter: "brightness(0.8)"
        }}
      >
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
          <img 
            src={playlistData?.thumbnail || assets.plus_icon}
            alt="Playlist Cover" 
            className="h-40 w-40 rounded-md shadow-2xl md:h-60 md:w-60" 
          />
          <div className="flex flex-col justify-end">
            <p className="text-xs font-normal md:text-sm">Playlist</p>
            <h1 className="mb-2 text-4xl font-black md:mb-6 md:text-8xl text-white">
              {playlistData?.name || "My Playlist"}
            </h1>
            <div className="flex items-center gap-2">
              <span className="font-medium"></span>
              <span className="opacity-70">0 songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div 
        className="relative px-8 py-6"
        style={{
          background: `linear-gradient(to bottom, ${secondaryColor} 0%, #121212 100%)`
        }}
      >
        <div className="flex items-center gap-8">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] hover:scale-105 hover:bg-[#1fdf64]">
            <img className="h-8 w-8" src={assets.play_icon} alt="Play" />
          </button>
          <button className="flex h-8 items-center justify-center rounded-full border-[1px] border-white px-4 opacity-70 hover:opacity-100">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;