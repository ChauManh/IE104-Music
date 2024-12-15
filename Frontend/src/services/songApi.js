import axios from "axios";

const createSong = async (trackId) => {
  try {
    const token = localStorage.getItem("access_token");
    return await axios.post(
      "http://localhost:3000/songs/create",
      { spotifyId: trackId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch (error) {
    console.error("Error fetching song ID from Spotify:", error);
    throw error;
  }
};

const getIdSpotifFromSongId = async (songId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");
    const response = await axios.get(`http://localhost:3000/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.spotifyId;
  } catch (error) {
    console.error("Error fetching song ID from Spotify:", error);
    throw error;
  }
};

const getDetailSong = async (songId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");
    return await axios.get(`http://localhost:3000/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error fetching song ID from Spotify:", error);
    throw error;
  }
};

const getDetailSongBySpotifyId = async (trackId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");
    return await axios.get(`http://localhost:3000/songs/by-spotify-id/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error fetching song ID from Spotify:", error);
    throw error;
  }
};
export { getIdSpotifFromSongId, getDetailSongBySpotifyId, createSong, getDetailSong };
