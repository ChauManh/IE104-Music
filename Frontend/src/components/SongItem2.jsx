import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const SongItem2 = ({ name, image, singer, id }) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      navigate(`/track/${id}`);
    } catch (error) {
      alert('Error navigating to track:', error.message);
    }
  };

  return (
    <div onClick={handleClick} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
        <img className='rounded' src={image} alt={name} />
        <p className='font-bold mt-2 mb-1'>{name}</p>
        <p className='text-[#b3b3b3] text-sm sm:text-xs'>• {singer}</p>
    </div>
  );
};

export default SongItem2;
