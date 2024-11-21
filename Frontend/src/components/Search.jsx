import React, { useState } from 'react';
import axios from 'axios';
import DisplayHome from '../components/DisplayHome';
import DisplayAlbum from '../components/DisplayAlbum';
import DisplaySong from '../components/DisplaySong';
import SearchPage from '../pages/SearchPage'; // Add this import
import { useLocation } from 'react-router-dom';

const Search = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || {
    tracks: [],
    albums: [],
    artists: []
  };
  const searchQuery = location.state?.searchQuery;

  // Get top result (first track, artist or album)
  const topResult = searchResults.tracks[0] || searchResults.artists[0] || searchResults.albums[0];

  return (
    <div className='px-6 pt-6 rounded-3xl bg-[#121212] text-white overflow-auto lg:w-[100%] lg:ml-0 mt-16'>
      <h1 className="text-2xl font-bold mb-6">Search results for "{searchQuery}"</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Top Result */}
        <section>
          <h2 className="text-xl font-bold mb-4">Top Result</h2>
          {topResult && (
            <div className="p-5 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors">
              <img 
                src={topResult.album?.images[0].url || topResult.images?.[0].url} 
                alt={topResult.name}
                className="w-24 h-24 rounded-md mb-4 shadow-lg"
              />
              <p className="text-2xl font-bold mb-2">{topResult.name}</p>
              <p className="text-sm text-gray-400">
               {topResult.type.charAt(0).toUpperCase()}{topResult.type.slice(1)} • {topResult.artists?.[0].name || 'Artist'}
              </p>
            </div>
          )}
        </section>

        {/* Songs Section */}
        <section className="pl-4">
          <h2 className="text-xl font-bold mb-4">Songs</h2>
          <div className="flex flex-col">
            {searchResults.tracks.slice(0, 4).map((track) => (
              <div key={track.id} className="flex items-center p-[4.75px] pl-3 hover:bg-[#282828] rounded-md transition-colors"> 
                <img src={track.album.images[0].url} alt={track.name} className="w-10 h-10 rounded mr-4" />
                <div>
                  <p className="font-medium">{track.name}</p>
                  <p className="text-sm text-gray-400">{track.artists[0].name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Artists Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Artists</h2>
        <div className="grid grid-cols-5 gap-6">
          {searchResults.artists.map((artist) => (
            <div key={artist.id} className="p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors">
              <img 
                src={artist.images[0]?.url} 
                alt={artist.name}
                className="w-full aspect-square rounded-full object-cover mb-4 shadow-lg"
              />
              <p className="font-bold">{artist.name}</p>
              <p className="text-sm text-gray-400">Artist</p>
            </div>
          ))}
        </div>
      </section>

      {/* Albums Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        <div className="grid grid-cols-5 gap-6">
          {searchResults.albums.map((album) => (
            <div key={album.id} className="p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors">
              <img 
                src={album.images[0].url} 
                alt={album.name}
                className="w-full aspect-square rounded-md object-cover mb-4 shadow-lg"
              />
              <p className="font-bold truncate">{album.name}</p>
              <p className="text-sm text-gray-400 truncate">{album.artists[0].name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Playlists</h2>
        <div className="grid grid-cols-5 gap-6">
          {searchResults.playlists?.map((playlist) => (
            <div key={playlist.id} className="p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors">
              <img 
                src={playlist.images[0]?.url} 
                alt={playlist.name}
                className="w-full aspect-square rounded-md object-cover mb-4 shadow-lg"
              />
              <p className="font-bold truncate">{playlist.name}</p>
              <p className="text-sm text-gray-400">By {playlist.owner.display_name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Search;