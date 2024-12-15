import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext'

const SongItem3 = ({ name, image, singer, id}) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      navigate(`/track/${id}`);
    } catch (error) {
      console.error('Error navigating to track:', error);
    }
  };

  return (
    <div onClick={handleClick} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-colors duration-200'>
      <div className='grid grid-cols-[auto_auto_1fr_1fr_auto] gap-6 items-center pl-2 py-2'>
        <img 
          className='rounded w-12 h-12 '
          src={image} 
          alt={name} 
        />
        <div className="overflow-hidden">
          <p className='font-medium truncate'>{name}</p>
          <p className='text-slate-200 text-sm'>{singer}</p>
        </div>
      </div>
    </div>
  );
};

export default SongItem3;