import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

const SongItem = ({ name, image, singer, id, duration, index }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      navigate(`/track/${id}`);
    } catch (error) {
      console.error("Error navigating to track:", error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-[180px] cursor-pointer rounded p-2 px-3 transition-colors duration-200 hover:bg-[#ffffff26]"
    >
      <div className="grid grid-cols-4 items-center gap-6 pl-2 pr-4">
        <p className="text-gray-400">{index + 1}</p>
        <img className="h-12 w-12 rounded" src={image} alt={name} />
        <div className="overflow-hidden">
          <p className="truncate font-medium">{name}</p>
          <p className="text-sm text-slate-200">{singer}</p>
        </div>
        <p>{duration}</p>
      </div>
    </div>
  );
};

export default SongItem;
