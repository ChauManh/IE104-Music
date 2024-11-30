import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../context/PlayerContext';
const AlbumItem = ({ id, name, image, singer, time }) => {
  const navigate = useNavigate();
  
  const { setAlbumTracks } = useContext(PlayerContext)
  const handleClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/album/${id}/tracks`);
      setAlbumTracks(response.data)
      navigate(`/album/${id}/tracks`);
      // alert('Inspect ra mà xem dữ liệu chứ chưa xong tính năng này');
    } catch (error) {
      alert('Error fetching track:', error.message);
    }
  };

  return (
    <div onClick={handleClick} className='min-w-[180px] p-3.5 rounded-md cursor-pointer hover:bg-[#ffffff26] flex flex-col items-center'>
      <img className='rounded-md w-full mb-2' src={image} alt={name} />
      <div className='w-full text-left'>
        <p className='font-weight-800  mb-[2px] max-w-[150px] leading-[23px] tracking-[0.2px]'>{name}</p>
        <p className='text-[#b3b3b3] font-weight-400 text-[13px] max-w-[150px]'>{time?.slice(0,4)} {singer}</p>
      </div>
    </div>
  );
};

export default AlbumItem;