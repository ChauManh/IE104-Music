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
    <div className='mb-6 px-4'>
      <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
      {albumsData.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
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
