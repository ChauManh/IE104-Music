import axios from "axios";

const fetchNewAlbums = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/album/new`);
    return response.data;
  } catch (error) {
    alert(error.message);
  }
};

const fetchAlbum = async (id) => {
  try {
    return await axios.get(`http://localhost:3000/album/${id}`);
  } catch (error) {
    alert(error.message);
  }
};

const fetchAlbumTracks = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/album/${id}/tracks`,
    );
    return response;
  } catch (error) {
    alert(error.message);
  }
};

export { fetchNewAlbums, fetchAlbum, fetchAlbumTracks };
