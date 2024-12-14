import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import { getTrack } from '../util/trackApi';

const SongItem2 = ({ name, image, singer, id }) => {
  const { playWithUri, setTrack } = useContext(PlayerContext);
  const handleClick = async () => {
    try {
      
      const data = await getTrack(id);
      const fetchTrackData = async () => {
        try {
          setTrack({
            name: data.name,
            image: data.image,
            singer: data.singer,
            id: data.id,
            uri: data.uri,
            duration: data.duration,
          });
          playWithUri(data.uri); 
        } catch (error) {
          console.error('Error fetching track:', error);
          alert('Error fetching track:', error.message);
        }
      };
  
      await fetchTrackData();
    } catch (error) {
      alert('Error navigating to track:', error.message);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col items-center rounded transition-colors  duration-200 hover:bg-[#1e1e1e] lg:p-2 xl:p-4"
    >
      <div className="relative mb-4 w-full sm:mb-3 md:mb-2">
        <div className="relative aspect-square w-full">
          <img
            className="h-full w-full rounded-lg object-cover sm:rounded-md"
            src={image}
            alt={name}
          />
          <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:right-3 md:bottom-2 md:right-2">
            <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#3be477] p-4 shadow-xl transition-all hover:scale-105 sm:h-12 sm:w-12 sm:p-3 md:h-10 md:w-10 md:p-2.5">
              <img
                className="h-full w-full"
                src={assets.play_icon}
                alt="Play"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-left">
        <p className="mb-2 truncate text-lg font-bold sm:mb-1.5 sm:text-base md:mb-1 md:text-sm">
          {name}
        </p>
        <p className="truncate text-sm text-[#b3b3b3] sm:text-xs">
            {singer}
        </p>
      </div>
    </div>
  );
};

export default SongItem2;
