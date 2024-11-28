import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SongItem from '../components/SongItem';
import AlbumItem from '../components/AlbumItem';
import PopupAbout from '../components/PopupAbout';

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/artist/${id}`);
        console.log('Artist data:', response.data); // Debugging log
        setArtist(response.data);

        const tracksResponse = await axios.get(`http://localhost:3000/artist/${id}/top-tracks`);
        console.log('Top tracks:', tracksResponse.data); // Debugging log
        setTopTracks(tracksResponse.data.tracks || []); // Ensure it's an array

        const albumsResponse = await axios.get(`http://localhost:3000/artist/${id}/albums`);
        console.log('Albums:', albumsResponse.data); // Debugging log
        setAlbums(albumsResponse.data.items || []); // Ensure it's an array
      } catch (error) {
        setError('Error fetching artist data');
        console.error('Error fetching artist:', error.response ? error.response.data : error.message);
      }
    };

    fetchArtistData();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!artist) return <div>Artist not found</div>;

  return (
    <div className="px-0 relative bg-[#121212] text-white w-full"> {/* Added background color and text color */}

      <div 
        className="h-[40vh] bg-gradient-to-b from-[#333333] to-[#121212] flex items-end p-6"
        style={{
          backgroundImage: `url(${artist.images[0]?.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="z-10">
          <p className="text-sm font-bold">Artist</p>
          <h1 className="text-8xl font-black mb-6">{artist.name}</h1>
          <p className="text-sm">{artist.followers.total.toLocaleString()} followers</p>
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" /> */}
      </div>

      <div className="px-6 py-4">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular</h2>
          <div className="flex flex-col">
            {Array.isArray(topTracks) && topTracks.map((track, index) => (
              <SongItem 
                key={track.id}
                id={track.id}
                name={track.name}
                image={track.album.images[2].url}
                singer={track.album.name}
                customSong="w-16 h-16" 
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Albums</h2>
          <div className="flex flex-row overflow-hidden overflow-x-scroll gap-6">
            {Array.isArray(albums) && albums.map((album, index) => (
              <AlbumItem
                key={album.id}
                id={album.id}
                name={album.name}
                image={album.images[0].url}
                time={album.release_date}
                singer={album.artists[0]?.name}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <div className="relative h-[60vh]" onClick={togglePopup}>
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${artist.images[0]?.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(50%)'
              }}
            />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full mt-auto">
              <p className="text-l font-bold">{artist.followers.total.toLocaleString()} monthly listeners</p>
              <p className="text-l ">{artist.description}zxc</p>
            </div>
          </div>
        </section>
      </div>

      {isPopupVisible && <PopupAbout onClose={togglePopup} />}
    </div>
  );
};

export default ArtistPage;