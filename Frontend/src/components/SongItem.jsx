import React, { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import axios from 'axios';


const SongItem = ({ name, image, singer, id }) => {
  // const { playWithId } = useContext(PlayerContext);
  const {setTrack}= useContext(PlayerContext);
  const handleClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/track/${id}`);
      // playWithId(id); // Có thể gọi playWithId nếu bạn muốn phát nhạc ngay lập tức

      setTrack({
        name:name,
        image:image,
        singer:singer,
        id:id
      })
      
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
