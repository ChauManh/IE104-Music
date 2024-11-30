import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets';

const DisplayAlbum = () => {
  const { albumTracks, playWithUri, albumsData } = useContext(PlayerContext); 
  const {id} = useParams();
  // const [view,setView]= useState([])
  const albumData = albumsData.find(album => album.id === id);
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // useEffect(() => {
  //   const loadAlbumsData = async () => {
  //     try {
  //       const storedAlbumsData = localStorage.getItem('albumsData');
  //       if (storedAlbumsData) {
  //         setAlbumData(JSON.parse(storedAlbumsData));
  //       } else {
  //         const data = await fetchViewSongbyID();
  //         setAlbumData(data);
  //         localStorage.setItem('albumsData', JSON.stringify(data));
  //       }
  //     } catch (error) {
  //       alert(`Error fetching data: ${error.message}`);
  //     }
  //   };

  //   loadAlbumsData();
  // }, []);
  
  return (
    <>
      <div className='mt-10 flex gap-8 pl-8 flex-col md:flex-row md:items-end'>
        <img 
          src={albumData.image} 
          alt={albumData.name} 
          className='w-60 h-60 rounded-md' 
        />
        <div className='flex flex-col'>
          <p>Album</p>
          <h2 className='text-5xl font-bold mb-4 md:text-7xl'>{albumData.name}</h2>
          <h4></h4>
          <p className='mt-1'>
            <img className='inline-block w-5' src={assets.spotify_logo} alt="Spotify Logo" />
            <b> {albumData.singer.join(', ')}</b> • {albumTracks.length} bài hát • {new Date(albumData.date).getFullYear()}
          </p>
        </div>
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
        {/* code o day */}
        abc abc
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
        <div className="flex items-center">
          <span className="w-8 text-right mr-4">#</span>
          <span className="truncate">Tiêu đề</span>
        </div>
        <p>Nghệ sĩ</p>
        <p className='hidden sm:block'>Lượt phát</p>
        <img className='m-auto w-4' src={assets.clock_icon} alt="Clock Icon" />
      </div>

      <hr />
      {
       albumTracks.map((track,index)=>(
        <div 
          onClick={() => playWithUri(track.id)} 
          key={index} 
          className='grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'
        >
          <div className="flex items-center">
            <span className="w-8 text-right mr-4 text-[#a7a7a7]">{index + 1}</span>
            <span className="text-white truncate">{track.name}</span>
          </div>
          <p className='text-[15px] truncate'>{track.singers.join(', ')}</p>
          <p className='text-[15px] hidden sm:block'>0</p>
          <p className='text-[15px] text-center'>{formatDuration(track.duration)}</p>
        </div>
      ))
      }
    </>
  );
};

export default DisplayAlbum;
