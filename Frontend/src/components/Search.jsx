import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get(`http://localhost:3000/search`, {
        params: {
          q: query,
          type: 'track,album,artist', // Search for tracks, albums, and artists
        },
      });

      setTracks(response.data.tracks.items);
      setAlbums(response.data.albums.items);
      setArtists(response.data.artists.items);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, albums..."
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <h2>Tracks</h2>
        {tracks.map((item) => (
          <div key={item.id}>
            <img src={item.album.images[0].url} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.artists[0].name}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Albums</h2>
        {albums.map((item) => (
          <div key={item.id}>
            <img src={item.images[0].url} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.artists[0].name}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Artists</h2>
        {artists.map((item) => (
          <div key={item.id}>
            <img src={item.images[0]?.url} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;