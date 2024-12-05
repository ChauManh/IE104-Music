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
      // Navigate to new album page
      navigate(`/album/${id}`);
    } catch (error) {
      console.error("Error navigating to album:", error.message);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex max-h-[286px] min-w-[210px] cursor-pointer flex-col items-center rounded-md p-3.5 hover:bg-[#1e1e1e]"
    >
      <div className="relative mb-2">
        <img
          className="h-[186px] w-[186px] rounded-md"
          src={image}
          alt={name}
        />
        <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <img
            className="h-12 w-12 cursor-pointer rounded-full bg-[#3be477] p-3 shadow-xl transition-all hover:scale-105"
            src={assets.play_icon}
            alt="Play"
          />
        </div>
      </div>
      <div className="w-full text-left">
        <p className="font-weight-800 mb-[2px] max-w-[150px] leading-[23px] tracking-[0.2px]">
          {name}
        </p>
        <p className="font-weight-400 max-w-[150px] text-[13px] text-[#b3b3b3]">
          {time?.slice(0, 4)} {singer}
        </p>
      </div>
    </div>
  );
};

export default AlbumItem;