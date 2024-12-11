import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";

const AlbumItem = ({ id, name, image, singer, time }) => {
  const navigate = useNavigate();
  const { setAlbumTracks } = useContext(PlayerContext);

  const handleClick = async () => {
    try {
      console.log("Album ID:", id); // Debug log to check ID
      navigate(`/album/${id}`);
    } catch (error) {
      console.error("Error navigating to album:", error.message);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col items-center rounded transition-colors  duration-200 hover:bg-[#1e1e1e] lg:p-2 xl:p-4"
    >
      <div className="relative mb-4 w-full sm:mb-3 md:mb-2">
        {/* Image container with responsive sizing */}
        <div className="relative aspect-square w-full">
          <img
            className="h-full w-full rounded-lg object-cover sm:rounded-md"
            src={image}
            alt={name}
          />
          {/* Play button with responsive sizing */}
          <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:right-3 md:bottom-2 md:right-2">
            <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#3be477] p-4 shadow-xl transition-all hover:scale-105 sm:h-12 sm:w-12 sm:p-3 md:h-10 md:w-10 md:p-2.5">
              <img
                className="h-full w-full"
                src={assets.play_icon}
                alt="Play"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Text content with responsive typography */}
      <div className="w-full text-left">
        <p className="mb-2 truncate text-lg font-bold sm:mb-1.5 sm:text-base md:mb-1 md:text-sm">
          {name}
        </p>
        <p className="truncate text-sm text-[#b3b3b3] sm:text-xs">
          {time?.slice(0, 4)} • {singer}
        </p>
      </div>
    </div>
  );
};

export default AlbumItem;
