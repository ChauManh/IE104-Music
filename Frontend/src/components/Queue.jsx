import React from 'react';
import { assets } from '../assets/assets';
const Queue = () => {

  const queue = [
    // {
    //   name: 'Mộng Yu',
    //   artists: [{ name: 'AMEE' }, { name: 'RPT MCK' }],
    //   album: { images: [ {src: {mongyu}}] }
    // },
    {
      name: 'Vì Anh Đâu Có Biết',
      artists: [{ name: 'Madihu' }, { name: 'Vũ' }],
      album: { images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiF4Bybcj0eD8wp-3Mz8h47uTJEguNpe1OTg&s' }] }
    },

  ];

  return (
    <div className=" top-0 right-0 max-h-[full] w-[20%] bg-[#121212] flex-col text-white pr-2 pl-2 overflow-y-auto rounded-3xl mt-14">
      <h2 className="font-semibold p-4 text-lg ">Queue</h2>
      <div className="bg-[#242424] rounded-xl mb-4">
        <h3 className="text-gray-300 mb- pl-4">Now Playing</h3>
        <div className="flex items-center gap-4 mb-4">
          <img src="https://placekitten.com/50/50" alt="Now Playing" className="w-12 h-12 rounded-md" />
          <div>
            <p>{queue[0].name}</p>
            <p className="text-gray-400 text-sm">{queue[0].artist}</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-gray-300 mb-2 pl-4">Next in Queue</h3>
        {queue.slice(1).map((item, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <img src="https://placekitten.com/50/50" alt={item.name} className="w-12 h-12 rounded-md" />
            <div>
              <p>{item.name}</p>
              <p className="text-gray-400 text-sm">{item.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;