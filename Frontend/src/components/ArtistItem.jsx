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
      className="group mx-[-10px] relative h-[290px] w-[224px] cursor-pointer rounded p-4 transition-colors duration-200 hover:bg-[#1e1e1e]"
    >
      <div className="relative mb-4 flex flex-col items-center">
        <div className="h-[200px] w-[200px] overflow-hidden rounded-full shadow-lg">
          <img
            className="h-full w-full object-cover"
            src={image}
            alt={name}
          />
        </div>
        {/* Play button overlay */}
        <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] shadow-xl transition-transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              play();
            }}
          >
            <img src={assets.play_icon} alt="Play" className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="text-left">
        <p className="mb-1 text-base font-bold">{name}</p>
        <p className="text-sm text-[#b3b3b3]">Nghệ sĩ</p>
      </div>
    </div>
  );
};

export default ArtistItem;
