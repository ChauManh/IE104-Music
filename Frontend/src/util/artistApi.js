import axios from "axios";

const getArtist = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/artist/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getArtistAlbums = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/artist/${id}/albums`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getArtistTopTracks = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/artist/${id}/top-tracks`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getRelatedArtists = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/artist/${id}/related-artists`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { getArtist, getArtistAlbums, getArtistTopTracks, getRelatedArtists };
