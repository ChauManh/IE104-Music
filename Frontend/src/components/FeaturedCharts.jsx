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

  return (
    <div className='mb-6 px-2 pb-2'>
      <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
      {albumsData.length > 0 ? (
        <div className='grid grid-flow-col auto-cols-[200px] gap-2 overflow-x-auto album-scrollbar'>
          {albumsData.slice(0, 10).map((item) => (
            <AlbumItem 
              key={item.id}
              name={item.name} 
              singer={item.singer} 
              id={item.id} 
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FeaturedCharts;
