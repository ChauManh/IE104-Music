import React, { useEffect, useContext } from 'react';
import { QueueProvider, useQueue } from '../context/QueueContext';
import { PlayerContext } from '../context/PlayerContext';

const Queue = () => {
  const { isVisible, queue, currentTrackIndex, setQueue, moveToTop, upcomingTracks } = useQueue();
  const { track, setTrack, playWithUri } = useContext(PlayerContext);

  const handleTrackClick = (index) => {
    const selectedTrack = queue[index];
    playWithUri(selectedTrack.uri);
    moveToTop(index);

    setTrack(selectedTrack);

    // Update queue: Keep the selected track at the top and the rest after it
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      newQueue.splice(0, newQueue.length, selectedTrack, ...newQueue.slice(index + 1));
      return newQueue;
    });
  };


  
  return (
    <div className={`max-h-full min-w-[20%] bg-[#121212] gap-2 flex-col text-white pr-2 pl-2 overflow-y-auto rounded-lg mt-16 shadow-lg ml-2 z-1 transform transition-all duration-300 ease-in-out ${!isVisible ? 'hidden': ''}`}>
      <h2 className="font-semibold p-4 text-lg">Danh sách chờ</h2>
      
      {/* Now Playing */}
      <div className="hover:bg-[#333] active:bg-[#555] focus:bg-[#444] cursor-pointer rounded-md mb-4" tabIndex={0}>
      <h3 className="text-gray-300 pl-4 pt-2">Đang phát</h3>
        <div className="flex items-center gap-4 mb-4 p-2">
            { track.image ? <
              img className='mt-2 mb-2 w-14 h-14 min-h-[100%] rounded' src={track.image} alt="" /> : "" }
            
          <div>
                <p className='text-sm hover:underline cursor-pointer'>{track.name}</p>
                <p className='text-xs text-gray-400 hover:underline cursor-pointer'>{track.singer}</p>
            </div>
        </div>
      </div>
            
      {/* Next in Queue */}
      <div>
        <h3 className="text-gray-300 mb-2 pl-4">Tiếp theo</h3>
        {upcomingTracks.map((item, index) => (
          <div
            key={index}
            onClick={() => handleTrackClick(currentTrackIndex + index + 1)}
            className="flex items-center gap-4 mb-2 pl-2 cursor-pointer hover:bg-[#333] active:bg-[#555] focus:bg-[#444] p-2 rounded-md"
            tabIndex={index}
          >
            <img 
              src={item.image || 'default_image_url'} 
              alt={item.name} 
              className="w-12 h-12 rounded-md" 
            />
            <div>
              <p>{item.name}</p>
              <p className="text-gray-400 text-sm">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
