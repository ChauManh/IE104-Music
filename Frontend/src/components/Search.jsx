import React from 'react';
import SongItem from './SongItem3';
import ArtistItem from './ArtistItem';
import AlbumItem from './AlbumItem'; // Import the AlbumItem component

const Search = ({ results, query, onArtistClick, onAlbumClick }) => {
  const topResult =
    results.tracks.items[0] ||
    results.artists.items[0] ||
    results.albums.items[0];

  return (
    <div className="px-4 pt-6 md:px-6">
      {query && (
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">
          Kết quả tìm kiếm cho "{query}"
        </h1>
      )}

      {/* Top Result and Songs Section */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <TopResultSection result={topResult} />
        <SongsSection tracks={results.tracks.items} />
      </div>

      {/* Artists Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">Nghệ sĩ</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {results.artists.items.map((artist) => (
            <ArtistItem
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image={artist.images[0]?.url}
            />
          ))}
        </div>
      </section>

      {/* Albums Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">Albums</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {results.albums.items.map((album) => (
            <AlbumItem
              key={album.id}
              id={album.id}
              name={album.name}
              image={album.images[0]?.url}
              singer={album.artists[0]?.name}
              time={album.release_date}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

// Top Result Section remains the same
const TopResultSection = ({ result }) => {
  if (!result) return null;

  return (
    <section>
      <h2 className='text-xl font-bold mb-4'>Top Result</h2>
      <div className='p-5 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors'>
        <img 
          src={result.album?.images[0].url || result.images?.[0].url}
          alt={result.name}
          className="mb-4 h-24 w-24 rounded-md shadow-lg"
        />
        <p className="mb-2 text-2xl font-bold">{result.name}</p>
        <p className="text-sm text-gray-400">
          {result.type.charAt(0).toUpperCase()}{result.type.slice(1)} • {result.artists?.[0].name || "Artist"}
        </p>
      </div>
    </section>
  );
};

// Songs Section using SongItem
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

const AlbumsSection = ({ albums, onAlbumClick }) => {
  if (!albums?.length) return null;

  return (
    <section className='mb-8'>
      <h2 className='text-2xl font-bold mb-4'>Albums</h2>
      <div className='grid grid-cols-5 gap-4'>
        {albums.map(album => (
          <div 
            key={album.id}
            onClick={() => onAlbumClick(album.id)}
            className='p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors cursor-pointer'
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
