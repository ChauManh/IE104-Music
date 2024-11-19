import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get(`http://localhost:3000/search`, {
        params: {
          q: query,
          type: 'track', // You can change this to 'album', 'artist', or 'playlist'
        },
      });
      setResults(response.data.tracks.items); // Adjust based on the type of search
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
        {results.map((item) => (
          <div key={item.id}>
            <img src={item.album.images[0].url} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.artists[0].name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;