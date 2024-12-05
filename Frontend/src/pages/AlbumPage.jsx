import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';
import ColorThief from 'colorthief';

const AlbumPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [album, setAlbum] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [error, setError] = useState(null);
  const [dominantColor, setDominantColor] = useState('#333333');
  const [secondaryColor, setSecondaryColor] = useState('#333333');

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/album/${id}`);
        console.log('Album data:', response.data); // Debugging log
        setAlbum(response.data);

        const artistResponse = await axios.get(`http://localhost:3000/artist/${response.data.artists[0].id}`);
        console.log('Artist data:', artistResponse.data); // Debugging log
        setArtist(artistResponse.data);

        const tracksResponse = await axios.get(`http://localhost:3000/album/${id}/tracks`);
        console.log('Album tracks:', tracksResponse.data); // Debugging log
        setAlbumTracks(tracksResponse.data); // Ensure it's an array

        // Get dominant color from album image
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = response.data.images[0]?.url;
        img.onload = () => {
          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(img);
          setDominantColor(`rgb(${dominantColor.join(',')})`);
          setSecondaryColor(`rgba(${dominantColor.join(',')}, 0.5)`); // Adjust the alpha for a lighter color
        };
      } catch (error) {
        setError('Error fetching album data');
        console.error('Error fetching album:', error.response ? error.response.data : error.message);
      }
    };

    fetchAlbumData();
  }, [id]);

  const playWithUri = (trackId) => {
    // Implement playWithUri function
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  const calculateTotalDuration = (tracks) => {
    const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);
    const minutes = Math.floor(totalDuration / 60000);
    const seconds = Math.floor((totalDuration % 60000) / 1000);
    return `${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây`;
  };

  if (error) return <div>{error}</div>;
  if (!album) return <div>  </div>;

  return (
    <>
      <div className="relative w-full py-4 px-6" style={{ background: `linear-gradient(to bottom, ${dominantColor} 30%, ${secondaryColor} 100%)`, filter: 'brightness(1.1)' }}>
        <div className="flex items-end pt-2 pb-4">
          <img src={album.images[0]?.url} alt={album.name} className="w-56 h-56 object-cover mr-6 rounded-xl" />
          <div className="z-10">
            <p className="text-sm font-normal">Album</p>
            <h1 className="text-6xl font-black mb-4">{album.name}</h1>
            <p className='mt-1'>
              {artist && <img className='inline-block w-6 h-6 rounded-full' src={artist.images[1]?.url} alt={artist.name} />}
              <b> {album.artists.map(artist => artist.name).join(', ')}</b> <span className="font-thin text-[#cccaca] opacity-90"> • {new Date(album.release_date).getFullYear()} • {albumTracks.length} bài hát, {calculateTotalDuration(albumTracks)}</span>
            </p>
          </div>
        </div>
      </div>



      <div className="relative px-6 py-4 z-10" style={{ background: `linear-gradient(to bottom, ${dominantColor} -25%, #121212 25%)` }}>

        <div className="relative flex items-center pt-2 pb-6 z-0">
          <div className="pr-8">
            <img
              className='w-14 h-14 rounded-[30px] border-[18px] border-[#3be477] bg-[#3be477] cursor-pointer opacity-70 hover:opacity-100 transition-all'
              src={assets.play_icon}
              alt=""
            />
          </div>

          <button className="flex p-4 border-2 h-4 items-center justify-center rounded-3xl border-solid cursor-pointer opacity-70 hover:opacity-100 transition-all">
            Follow
          </button>
        </div>

        <div className='grid grid-cols-[1fr_auto_auto] mt-10 mb-4 pl-2 text-[#a7a7a7]'>
          <div className="flex items-center">
            <span className="w-8 text-right mr-4">#</span>
            <span className="pr-10">Tiêu đề</span>
          </div>
          <img className='ml-auto my-auto w-4 mr-16' src={assets.clock_icon} alt="Clock Icon" />
        </div>

        <hr className="border-top-1 bg-[#30363b] opacity-15" />
        <br></br>

        {Array.isArray(albumTracks) &&
          albumTracks.map((track, index) => (
            <div 
              onClick={() => playWithUri(track.id)} 
              key={index} 
              className='grid grid-cols-[auto_1fr_auto] gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded-s'
            >
              <div className="flex items-center">
                <p className="w-8 text-right mr-4">{index + 1}</p>
                <div className="flex flex-col">
                  <p className="truncate text-white font-normal">{track.name}</p>
                  <p className='text-[14px] truncate'>{track.singers.join(', ')}</p>
                </div>
              </div>
              <p className="text-right mr-10">{formatDuration(track.duration)}</p>
            </div>
          ))}

      
      </div>
    </>
  );
};

export default AlbumPage;