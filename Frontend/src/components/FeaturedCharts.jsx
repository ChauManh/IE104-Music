import React, { useEffect, useState } from 'react';
import AlbumItem from './AlbumItem';
import axios from 'axios';

const FeaturedCharts = () => {
  const [albumsData, setAlbumData] = useState([]);

  useEffect(() => {
    const fetchNewAlbums = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/album/new`);
        setAlbumData(response.data);

        // Lưu dữ liệu vào localStorage
        localStorage.setItem('albumsData', JSON.stringify(response.data));
      } catch (error) {
        alert(error.message);
      }
    };

    // Kiểm tra dữ liệu trong localStorage trước
    const storedAlbumsData = localStorage.getItem('albumsData');
    if (storedAlbumsData) {
      setAlbumData(JSON.parse(storedAlbumsData));
    } else {
      fetchNewAlbums();
    }
  }, []);

  return (
    <div className='mb-6'>
      <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
      <div className='flex overflow-auto'>
        {albumsData.length > 0 ? (
          albumsData.map((item, index) => (
            <AlbumItem key={index} name={item.name} singer={item.singer} id={item.id} image={item.image} />
          ))
        ) : (
          <p>Loading...</p> // Hiển thị loading khi dữ liệu chưa có
        )}
      </div>
    </div>
  );
}

export default FeaturedCharts;
