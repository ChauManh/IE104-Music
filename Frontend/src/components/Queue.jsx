import React, { useEffect, useContext } from 'react';
import { assets, songsData } from '../assets/assets';
import { useQueue } from '../context/QueueContext';
import { PlayerContext } from '../context/PlayerContext';

const Queue = () => {
  const { isVisible, queue, currentTrackIndex, setQueue, moveToTop } = useQueue();
  const { track, setTrack } = useContext(PlayerContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = songsData.map(song => ({
        name: song.name,
        artists: [{ name: song.desc }],
        album: { 
          images: [{ url: song.image }]
        },
        duration: song.duration,
        file: song.file
      }));
      
      setQueue(data);
    };

    fetchData();
  }, []);

  const handleTrackClick = (index) => {
    moveToTop(index);
    setTrack(queue[index]);
  };

  const upcomingTracks = queue.filter((item, index) => 
    index > currentTrackIndex && item.name !== track.name
  );

  return (
    <div className={`max-h-full min-w-[20%] bg-[#121212] gap-2 flex-col text-white pr-2 pl-2 overflow-y-auto rounded-l-3xl mt-16 shadow-lg ml-2 z-1 transform transition-all duration-300 ease-in-out ${!isVisible ? 'hidden': ''}`}>
      <h2 className="font-semibold p-4 text-lg">Queue</h2>
      
      {/* Now Playing */}
      <div className="hover:bg-[#333] active:bg-[#555] focus:bg-[#444] cursor-pointer rounded-md mb-4" tabIndex={0}>
        <h3 className="text-gray-300 pl-4 pt-2">Now Playing</h3>
        <div className="flex items-center gap-4 mb-4 p-2">
          <img src={track.image} alt="Now Playing" className="w-12 h-12 rounded-md" />
          <div>
            <p className='text-[#32c967]'>{track.name}</p>
            <p className="text-gray-400 text-sm">{track.desc}</p>
          </div>
        </div>
      </div>
      
      {/* Next in Queue */}
      <div>
        <h3 className="text-gray-300 mb-2 pl-4">Next in Queue</h3>
        {upcomingTracks.map((item, index) => (
          <div
            key={index}
            onClick={() => handleTrackClick(currentTrackIndex + index + 1)}
            className="flex items-center gap-4 mb-2 pl-2 cursor-pointer hover:bg-[#333] active:bg-[#555] focus:bg-[#444] p-2 rounded-md"
            tabIndex={0}
          >
            <img src={item.album.images[0].url} alt={item.name} className="w-12 h-12 rounded-md" />
            <div>
              <p>{item.name}</p>
              <p className="text-gray-400 text-sm">{item.artists[0].name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
