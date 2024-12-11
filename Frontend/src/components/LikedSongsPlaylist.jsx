import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ColorThief from 'colorthief';
import { assets } from '../assets/assets';

const LikedSongsPlaylist = ({ token }) => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [dominantColor, setDominantColor] = useState("#333333");
  const [secondaryColor, setSecondaryColor] = useState("#121212");
  const [showNotification, setShowNotification] = useState(false);

  // Notification component
  const Notification = ({ message }) => (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="rounded-full bg-[#1ed760] px-4 py-2 text-center text-sm font-medium text-black shadow-lg">
        <span>{message}</span>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/get_playlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const likedPlaylist = response.data.playlists.find(
          playlist => playlist.name === "Bài hát đã thích"
        );

        if (likedPlaylist && likedPlaylist.songs.length > 0) {
          const songsWithDetails = await Promise.all(
            likedPlaylist.songs.map(async (songId) => {
              const songResponse = await axios.get(
                `http://localhost:3000/songs/${songId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return songResponse.data;
            })
          );
          setLikedSongs(songsWithDetails);
        }

        // Set dominant color from playlist thumbnail
        if (likedPlaylist?.thumbnail) {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = likedPlaylist.thumbnail;
          img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            setDominantColor(`rgb(${dominantColor.join(",")})`);
            setSecondaryColor(`rgba(${dominantColor.join(",")}, 0.5)`);
          };
        }
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };

    if (token) {
      fetchLikedSongs();
    }
  }, [token]);

  return (
    <div className="relative w-full bg-[#121212] text-white">
      {/* Header section */}
      <div
        className="flex h-[340px] items-end p-8"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
          <div className="relative group">
            <img
              src={assets.like_icon}
              alt="Liked Songs"
              className="h-30 w-30 rounded-md shadow-2xl md:h-60 md:w-60 object-cover"
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs font-normal md:text-sm">Playlist</p>
            <h1 className="mb-2 text-4xl font-black text-white md:mb-6 md:text-8xl">
              Bài hát đã thích
            </h1>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-8 py-6">
        {likedSongs.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-[#b3b3b3]">
              <span className="flex items-center">#</span>
              <span className="flex items-center">Tiêu đề</span>
              <span className="flex items-center">Album</span>
              <span className="flex items-center">Ngày thêm</span>
              <div className="flex items-center justify-end">
                <img src={assets.clock_icon} alt="Duration" className="h-5 w-5" />
              </div>
            </div>

            <hr className="my-2 border-t border-[#2a2a2a]" />

            {/* Song List */}
            <div className="mt-4 flex flex-col gap-2">
              {likedSongs.map((song, index) => (
                <div
                  key={song._id}
                  className="group grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 rounded-md px-4 py-2 text-sm hover:bg-[#ffffff1a]"
                >
                  <span className="flex items-center text-[#b3b3b3]">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="h-10 w-10 rounded"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-white">{song.title}</span>
                      <span className="truncate text-[#b3b3b3]">
                        {song.artistName}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center overflow-hidden truncate text-[#b3b3b3]">
                    {song.album || "Unknown Album"}
                  </span>
                  <span className="flex items-center text-[#b3b3b3]">
                    {new Date(song.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center justify-end text-[#b3b3b3]">
                    {Math.floor(song.duration / 60000)}:
                    {String(Math.floor((song.duration % 60000) / 1000)).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showNotification && (
        <Notification message="Đã xóa khỏi Bài hát đã thích" />
      )}
    </div>
  );
};

export default LikedSongsPlaylist;