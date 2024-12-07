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
      navigate(`/album/${id}`);
    } catch (error) {
      console.error("Error navigating to album:", error.message);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col items-center rounded p-2 sm:p-3 hover:bg-[#1e1e1e]"
      style={{ width: '200px' }} // Set a fixed width for consistency
    >
      <div className="relative mb-2 w-full">
        {/* Image container with responsive sizing */}
        <div className="relative aspect-square w-full">
          <img
            className="h-full w-full rounded-md object-cover"
            src={image}
            alt={name}
            style={{ height: '200px', width: '200px' }} // Set fixed dimensions for the image
          />
          {/* Play button with responsive sizing */}
          <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <img
              className="h-8 w-8 cursor-pointer rounded-full bg-[#3be477] p-2 shadow-xl transition-all hover:scale-105 sm:h-10 sm:w-10 sm:p-2.5 md:h-12 md:w-12 md:p-3"
              src={assets.play_icon}
              alt="Play"
            />
          </div>
        </div>
      </div>
      {/* Text content with responsive font sizes */}
      <div className="w-full text-left">
        <p className="mb-1 truncate text-sm font-bold sm:text-base">
          {name}
        </p>
        <p className="truncate text-xs text-[#b3b3b3] sm:text-sm">
          {time?.slice(0, 4)} • {singer}
        </p>
      </div>
    </div>
  );
};

export default AlbumItem;