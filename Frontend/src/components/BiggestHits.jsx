import React, { useEffect, useState } from 'react';
import SongItem2 from './SongItem2';
import { fetchPopularTracks } from '../util/api';
import { PlayerContext } from '../context/PlayerContext';

const BiggestHits = () => {
  const [tracksData, setTrackData] = useState([]);

  useEffect(() => {
    const loadTracksData = async () => {
      try {
        const storedTracksData = localStorage.getItem('tracksData');
        // if (storedTracksData && storedTracksData.length > 1) {
        //   const parsedData = JSON.parse(storedTracksData);
        //   setTrackData(parsedData); // Dữ liệu từ localStorage
        // } else {
          const data = await fetchPopularTracks(); // Fetch API nếu không có trong localStorage
          setTrackData(data);
          localStorage.setItem('tracksData', JSON.stringify(data));
        // }
      } catch (error) {
        alert(`Error fetching data: ${error.message}`);
      }
    };
    loadTracksData();
  }, []);

  return (
    <div className='mb-6'>
      <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>
      <div className='flex overflow-auto'>
        {tracksData.length > 0 ? (
          tracksData.slice(0, 10).map((item, index) => (
            <SongItem2  
            key={index} 
            name={item.name} 
            singer={item.singer} 
            id={item.id} 
            image={item.image} 
            uri={item.uri} 
            duration={item.duration} />
          ))
        ) : (
          <p>Loading...</p> // Hiển thị loading khi dữ liệu chưa có
        )}
      </div>
    </div>
  );
}

export default BiggestHits;
