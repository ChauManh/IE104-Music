import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import SongItem from '../components/SongItem';

const SearchPage = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || {
    tracks: { items: [] },
    albums: { items: [] },
    artists: { items: [] }
  };
  const searchQuery = location.state?.searchQuery;

  return (
    <>
      <Navbar />
      <div className='px-6'>
        {searchQuery && (
          <h1 className='text-3xl font-bold mb-6'>Results for "{searchQuery}"</h1>
        )}

        {/* Tracks Section */}
        {searchResults.tracks.items?.length > 0 && (
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Tracks</h2>
            <div className='grid grid-cols-4 gap-4'>
              {searchResults.tracks.items.map((track) => (
                <SongItem 
                  key={track.id}
                  id={track.id}
                  name={track.name}
                  image={track.album.images[0].url}
                  singer={track.artists[0].name}
                />
              ))}
            </div>
          </section>
        )}

        {/* Albums Section */}
        {searchResults.albums.items?.length > 0 && (
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Albums</h2>
            <div className='grid grid-cols-4 gap-4'>
              {searchResults.albums.items.map((album) => (
                <div key={album.id} className='p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors'>
                  <img src={album.images[0].url} alt={album.name} className='w-full aspect-square object-cover rounded-md mb-4'/>
                  <p className='font-semibold truncate'>{album.name}</p>
                  <p className='text-gray-400 text-sm truncate'>{album.artists[0].name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Artists Section */}
        {searchResults.artists.items?.length > 0 && (
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Artists</h2>
            <div className='grid grid-cols-4 gap-4'>
              {searchResults.artists.items.map((artist) => (
                <div key={artist.id} className='p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors'>
                  <img 
                    src={artist.images[0]?.url} 
                    alt={artist.name} 
                    className='w-full aspect-square object-cover rounded-full mb-4'
                  />
                  <p className='font-semibold text-center truncate'>{artist.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default SearchPage;