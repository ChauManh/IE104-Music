import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const PlaylistItem = ({ playlist }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/playlist/${playlist._id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group flex cursor-pointer items-center justify-between rounded p-2 transition-colors hover:bg-[#ffffff1a]"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12">
          <img
            src={playlist.thumbnail || assets.plus_icon}
            alt={playlist.name}
            className="h-full w-full rounded object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-medium text-white">{playlist.name}</p>
          <p className="text-sm text-[#b3b3b3]">
            Danh sách phát của bạn
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;