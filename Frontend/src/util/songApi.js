import axios from "axios";

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

export { getIdSpotifFromSongId };
