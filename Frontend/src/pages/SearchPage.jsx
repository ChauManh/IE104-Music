import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Search from '../components/Search';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { query } = useParams();
  
  const searchResults = location.state?.searchResults || {
    tracks: { items: [] },
    albums: { items: [] },
    artists: { items: [] }
  };
  
  const searchQuery = location.state?.searchQuery || decodeURIComponent(query);

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <>
      <Navbar />
      <Search
        results={searchResults}
        query={searchQuery}
        onArtistClick={handleArtistClick}
      />
    </>
  );
};

export default SearchPage;