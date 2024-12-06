import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'
import { PlayerContext } from '../context/PlayerContext'
import { useQueue } from '../context/QueueContext';

const SongItem = ({ name, image, singer, id, duration }) => {
  const navigate = useNavigate();
  const {play,  pause,  like  } = useContext(PlayerContext);
  const handleClick = async () => {
    try {
      navigate(`/track/${id}`);
    } catch (error) {
      alert('Error navigating to track:', error.message);
    }
  };

  return (
    <div onClick={handleClick} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-colors duration-200'>
      <div className='grid grid-cols-4 gap-6 items-center pl-2 pr-4'>
        <img 
          className='rounded w-12 h-12'
          src={image} 
          alt={name} 
        />
        <div className="overflow-hidden">
          <p className='font-medium truncate'>{name}</p>
          <p className='text-slate-200 text-sm'>{singer}</p>
        </div>
        <p>{duration}</p>
        <button>
          <img
                className='w-4 h-4  cursor-pointer opacity-70 hover:opacity-100 transition-all'
                src={assets.like_icon}
                alt=""
          />
        </button>
      </div>
    </div>
  );
};

export default SongItem;