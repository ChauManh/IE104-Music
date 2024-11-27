import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const SongItem = ({ name, image, singer, id }) => {
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
      <div className='flex items-center gap-4 pl-2'>
        <img 
          className={`rounded w-12 h-12`}
          src={image} 
          alt={name} 
        />
        <div>
          <p className='font-bold mt-2 mb-1'>{name}</p>
          <p className='text-slate-200 text-sm'>{singer}</p>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
