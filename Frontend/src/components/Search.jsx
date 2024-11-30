import React from 'react';
import SongItem from './SongItem3';

const Search = ({ results, query, onArtistClick }) => {
  const topResult = results.tracks.items[0] || results.artists.items[0] || results.albums.items[0];

  return (
    <div className='px-6 pt-6'>
      {query && (
        <h1 className='text-3xl font-bold mb-6'>Results for "{query}"</h1>
      )}

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Top Result */}
        <TopResultSection result={topResult} />
        
        {/* Songs Preview */}
        <SongsSection tracks={results.tracks.items} />
      </div>

      {/* Artists Grid */}
      <ArtistsSection 
        artists={results.artists.items} 
        onArtistClick={onArtistClick}
      />

      {/* Albums Grid */}
      <AlbumsSection albums={results.albums.items} />
    </div>
  );
};

const TopResultSection = ({ result }) => {
  if (!result) return null;
  
  return (
    <section>
      <h2 className='text-xl font-bold mb-4'>Top Result</h2>
      <div className='p-5 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors'>
        <img 
          src={result.album?.images[0].url || result.images?.[0].url}
          alt={result.name}
          className='w-24 h-24 rounded-md mb-4 shadow-lg'
        />
        <p className='text-2xl font-bold mb-2'>{result.name}</p>
        <p className='text-sm text-gray-400'>
          {result.type.charAt(0).toUpperCase()}{result.type.slice(1)} • {result.artists?.[0].name || 'Artist'}
        </p>
      </div>
    </section>
  );
};

const SongsSection = ({ tracks }) => {
  if (!tracks?.length) return null;

  return (
    <section className='pl-4 '>
      <h2 className='text-xl font-bold mb-4'>Songs</h2>
      <div className='flex flex-col gap-2'>
        {tracks.slice(0, 4).map(track => (
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
  );
};

const ArtistsSection = ({ artists, onArtistClick }) => {
  if (!artists?.length) return null;

  return (
    <section className='mb-8'>
      <h2 className='text-2xl font-bold mb-4'>Artists</h2>
      <div className='grid grid-cols-5 gap-4'>
        {artists.map(artist => (
          <div 
            key={artist.id}
            onClick={() => onArtistClick(artist.id)}
            className='p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors cursor-pointer'
          >
            <img 
              src={artist.images[0]?.url}
              alt={artist.name}
              className='w-full aspect-square rounded-full object-cover mb-4'
            />
            <p className='font-semibold text-center truncate'>{artist.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const AlbumsSection = ({ albums }) => {
  if (!albums?.length) return null;

  return (
    <section className='mb-8'>
      <h2 className='text-2xl font-bold mb-4'>Albums</h2>
      <div className='grid grid-cols-5 gap-4'>
        {albums.map(album => (
          <div 
            key={album.id}
            className='p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors'
          >
            <img 
              src={album.images[0].url}
              alt={album.name} 
              className='w-full aspect-square object-cover rounded-md mb-4'
            />
            <p className='font-semibold truncate'>{album.name}</p>
            <p className='text-gray-400 text-sm truncate'>{album.artists[0].name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Search;