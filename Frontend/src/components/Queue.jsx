import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';

const Queue = () => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          name: 'Mộng Yu',
          artists: [{ name: 'AMEE' }, { name: 'RPT MCK' }],
          album: { images: [{ url: assets.mongyu }] }
        },
        {
          name: 'Vì Anh Đâu Có Biết',
          artists: [{ name: 'Madihu' }, { name: 'Vũ' }],
          album: { images: [{ url: assets.vianhdaucobiet }] }
        },
        // Thêm các bài hát khác nếu cần
      ];
      setQueue(data);
    };

    fetchData();
  }, []);

  return (
    <div className="top-2 right-0 h-full w-[19.5%] bg-[#121212] flex-col text-white pr-2 pl-4 overflow-y-auto rounded-l-3xl mt-14 shadow-lg ml-2">
      <h2 className="font-semibold p-4 text-lg">Queue</h2>
      <div className="bg-[#242424] rounded-xl mb-4">
        <h3 className="text-gray-300 pl-4 pt-2">Now Playing</h3>
        <div className="flex items-center gap-4 mb-4 p-2">
          {queue.length > 0 && (
            <>
              <img src={queue[0].album.images[0].url} alt="Now Playing" className="w-12 h-12 rounded-md" />
              <div>
                <p className='text-[#32c967]'>{queue[0].name}</p>
                <p className="text-gray-400 text-sm">{queue[0].artists.map(artist => artist.name).join(', ')}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-gray-300 mb-2 pl-4">Next in Queue</h3>
        {queue.slice(1).map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 mb-2 pl-2 cursor-pointer hover:bg-[#333] focus:bg-[#444] p-2 rounded-md"
            tabIndex={0}
          >
            <img src={item.album.images[0].url} alt={item.name} className="w-12 h-12 rounded-md" />
            <div>
              <p>{item.name}</p>
              <p className="text-gray-400 text-sm">{item.artists.map(artist => artist.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Queue;


