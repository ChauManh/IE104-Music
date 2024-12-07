import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const ArtistItem = ({ name, image, id }) => {
  const navigate = useNavigate();
  const { play, pause } = useContext(PlayerContext);

  const handleClick = async (e) => {
    try {
      navigate(`/artist/${id}`);
    } catch (error) {
      console.error("Error navigating to artist:", error.message);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex h-full w-full cursor-pointer flex-col rounded p-3 transition-colors duration-200 hover:bg-[#1e1e1e]"
    >
      <div className="relative mb-4">
        {/* Fixed aspect ratio container */}
        <div className="relative pb-[100%]">
          {/* Image container with overflow handling */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover"
              src={image || assets.avatar}
              alt={name}
            />
          </div>
          {/* Play button overlay */}
          <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1ed760] shadow-xl transition-transform hover:scale-105 sm:h-10 sm:w-10 md:h-12 md:w-12"
              onClick={(e) => {
                e.stopPropagation();
                play();
              }}
            >
              <img 
                src={assets.play_icon} 
                alt="Play" 
                className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" 
              />
            </button>
          </div>
        </div>
      </div>
      <div className="text-left">
        <p className="mb-1 truncate text-sm font-bold sm:text-base">{name}</p>
        <p className="text-xs text-[#b3b3b3] sm:text-sm">Nghệ sĩ</p>
      </div>
    </div>
  );
};

export default ArtistItem;
