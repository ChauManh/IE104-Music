import React, { useContext, useEffect, useState } from 'react';
import AlbumItem from './AlbumItem';
import { fetchNewAlbums } from '../util/api';
import { PlayerContext } from '../context/PlayerContext';

const FeaturedCharts = () => {
  const { albumsData, setAlbumData } = useContext(PlayerContext)
  
  useEffect(() => {
    const loadAlbumsData = async () => {
      try {
        const storedAlbumsData = localStorage.getItem('albumsData');
        if (storedAlbumsData) {
          setAlbumData(JSON.parse(storedAlbumsData));
        } else {
          const data = await fetchNewAlbums();
          setAlbumData(data);
          localStorage.setItem('albumsData', JSON.stringify(data));
        }
      } catch (error) {
        alert(`Error fetching data: ${error.message}`);
      }
    };

    loadAlbumsData();
  }, []);
  // console.log(albumsData);
  
 

 return (
  <div className='mb-6'>
    <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
    <div className='flex overflow-auto'>
      {albumsData.length > 0 ? (
        albumsData.slice(0, 10).map((item, index) => (
          <AlbumItem 
            key={index} 
            name={item.name} 
            singer={item.singer} 
            id={item.id} 
            image={item.image}
          />
        ))
      ) : (
        <p>Loading...</p> // Hiển thị loading khi dữ liệu chưa có
      )}
    </div>
  </div>
);

}

export default FeaturedCharts;
