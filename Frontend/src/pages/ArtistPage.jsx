import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SongItem from '../components/SongItem';

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/artist/${id}`);
        setArtist(response.data);

        const tracksResponse = await axios.get(`http://localhost:3000/artist/${id}/top-tracks`);
        setTopTracks(tracksResponse.data);

        const albumsResponse = await axios.get(`http://localhost:3000/artist/${id}/albums`);
        setAlbums(albumsResponse.data);
      } catch (error) {
        setError('Error fetching artist data');
        console.error('Error fetching artist:', error.response ? error.response.data : error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!artist) return <div>Artist not found</div>;

  return (
    <>
      <Navbar />
      <div className="relative">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
        </div>

        <div className="px-6 py-4">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular</h2>
            <div className="flex flex-col">
              {topTracks.map((track, index) => (
                <SongItem 
                  key={track.id}
                  id={track.id}
                  name={track.name}
                  image={track.album.images[2].url}
                  singer={track.album.name}
                  customSong="w-16 h-16" // Custom size
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
            <div className="grid grid-cols-5 gap-6">
              {albums.map(album => (
                <div 
                  key={album.id}
                  className="p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
                >
                  <img 
                    src={album.images[0].url} 
                    alt={album.name}
                    className="w-full aspect-square object-cover rounded-md mb-4 shadow-lg" 
                  />
                  <p className="font-bold truncate">{album.name}</p>
                  <p className="text-sm text-gray-400">{album.release_date.split('-')[0]} • Album</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ArtistPage;