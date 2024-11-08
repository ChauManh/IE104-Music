import React, { useEffect, useState } from 'react'
import { songsData } from '../assets/assets'
import SongItem from './SongItem'
import axios from 'axios'

const BiggestHits = () => {
  const [tracksData, setTrackData] = useState([]);
  useEffect(() => {
    const fetchPopularTracks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/track/popular`);
        setTrackData(response.data); 
      } catch (error) {
        alert(error.message);
      }
    };

    fetchPopularTracks();
  }, []);
  return (
    <div className='mb-6'>
            <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>
            <div className='flex overflow-auto'>
            {tracksData.length > 0 ? (
                        tracksData.map((item, index) => (
                            <SongItem key={index} name={item.name} singer={item.singer} id={item.id} image={item.image} />
                        ))
                    ) : (
                        <p>Loading...</p> // Hiển thị loading khi dữ liệu chưa có
                    )}
            </div>
    </div>
  )
}

export default BiggestHits