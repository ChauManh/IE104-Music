import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtist, getArtistAlbums } from '../services/artistApi';

const PopupAbout = ({ onClose }) => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await getArtist(id);
        setArtist(response.data);

        const albumsResponse = await getArtistAlbums(id);
        setAlbums(albumsResponse.data.items || []);
      } catch (error) {
        setError('Error fetching artist data');
        console.error('Error fetching artist:', error.response ? error.response.data : error.message);
      }
    };

    fetchArtistData();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!artist) return <div></div>;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative overflow-hidden overflow-y-scroll bg-[#121212] pb-2 rounded-lg shadow-lg text-white max-w-[768px] h-[70vh]">
          <button 
            onClick={onClose} 
            className="absolute top-[0px] left-[93%]  text-white  rounded-full"
          >
            <p className="pb-1 font-bold text-xl pt-2">x</p>
          </button>
          <div className='h-[70%] bg-black'>
            <img src={`${artist.images[0]?.url}`} alt="day la anh" className='h-full ml-auto mr-auto' />
          </div>
          <div className="p-6 pt-9 grid grid-cols-4 ">
            <div className='px-6 w-[300px] col-span-1'>
              <h3 className="text-3xl font-bold">{artist.followers.total.toLocaleString()}</h3>
              <p className="mb-8">followers</p>
              <h3 className="text-3xl font-bold">{artist.followers.total.toLocaleString()}</h3>
              <p className="mb-8">monthly listeners</p>
              <h4 className="text-l font-bold">Ho Chi Minh City</h4>
              <p className="text-xs font-normal text-[#c0c0c0] mb-2">{Math.floor(100000 + Math.random() * 1000000).toLocaleString()} listeners</p>
              <h4 className="text-l font-bold">Da Nang</h4>
              <p className="text-xs font-normal text-[#c0c0c0] mb-2">{Math.floor(100000 + Math.random() * 60000).toLocaleString()} listeners</p>
              <h4 className="text-l font-bold">Binh Phuoc</h4>
              <p className="text-xs font-normal text-[#c0c0c0] mb-2">{Math.floor(100000 + Math.random() * 50000).toLocaleString()} listeners</p>
            </div>
            <div className='px-6  col-span-3'>
              <h3 className="mb-4">{albums[0]?.name}</h3>
              <p>{artist.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupAbout;