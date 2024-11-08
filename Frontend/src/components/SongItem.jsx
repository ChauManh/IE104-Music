import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { PlayerContext } from '../context/PlayerContext';
import axios from 'axios';

const SongItem = ({ name, image, singer, id }) => {
  // const { playWithId } = useContext(PlayerContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await axios.get(`http://localhost:3000/track/${id}`);

      navigate(`/track/${id}`);
      // playWithId(id); // Có thể gọi playWithId nếu bạn muốn phát nhạc ngay lập tức
    } catch (error) {
      alert('Error fetching track:', error.message);
    }
  };

  return (
    <div onClick={handleClick} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
      <img className='rounded' src={image} alt={name} />
      <p className='font-bold mt-2 mb-1'>{name}</p>
      <p className='text-slate-200 text-sm'>{singer}</p>
    </div>
  );
};

export default SongItem;
