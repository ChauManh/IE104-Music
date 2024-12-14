import axios from "axios";

const createPlaylist = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    // Don't send a name, let the backend generate it
    const response = await axios.post(
      "http://localhost:3000/user/create_playlist",
      {
        type: "playlist", // Explicitly set type as 'playlist'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.playlist;
  } catch (error) {
    console.error("API createPlaylist error:", error);
    throw error;
  }
};

const addSongToPlaylist = async (playlistId, trackId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const songResponse = await axios.post(
      "http://localhost:3000/songs/create",
      { spotifyId: trackId },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const response = await axios.post(
      "http://localhost:3000/user/playlist/add_song",
      {
        playlistID: playlistId,
        songID: songResponse.data.song._id,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
};

const addLikedSong = async (trackId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.post(
      "http://localhost:3000/user/favorites/add",
      { trackId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API addLikedSong error:", error);
    throw error;
  }
};

const removeLikedSong = async (trackId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.delete(
      "http://localhost:3000/user/favorites/remove",
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { trackId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API removeLikedSong error:", error);
    throw error;
  }
};

const followArtist = async (artistId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.post(
      "http://localhost:3000/user/artists/follow",
      { artistId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API followArtist error:", error);
    throw error;
  }
};

const unfollowArtist = async (artistId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.delete(
      "http://localhost:3000/user/artists/unfollow",
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { artistId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API unfollowArtist error:", error);
    throw error;
  }
};

const addLikedAlbum = async (albumId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.post(
      "http://localhost:3000/user/albums/add",
      { albumId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API addLikedAlbum error:", error);
    throw error;
  }
};

const removeLikedAlbum = async (albumId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.delete(
      "http://localhost:3000/user/albums/remove",
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { albumId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API removeLikedAlbum error:", error);
    throw error;
  }
};

const getPlaylistById = async (playlistId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await axios.get(
      `http://localhost:3000/user/playlist/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error;
  }
};

const removeSongFromPlaylist = async (playlistId, songId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await axios.delete(
      "http://localhost:3000/user/playlist/remove_song",
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { playlistID: playlistId, songID: songId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
};

const updatePlaylistThumbnail = async (playlistId, file) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const formData = new FormData();
    formData.append("thumbnail", file);
    formData.append("playlistId", playlistId);

    const response = await axios.post(
      "http://localhost:3000/user/playlist/update_thumbnail",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating thumbnail:", error);
    throw error;
  }
};

const fetchPlaylistData = async (playlistId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await axios.get(
      `http://localhost:3000/user/playlist/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { playlist } = response.data;

    // Fetch song details if playlist has songs
    if (playlist.songs && playlist.songs.length > 0) {
      const songsWithDetails = await Promise.all(
        playlist.songs.map(async (songId) => {
          const songResponse = await axios.get(
            `http://localhost:3000/songs/${songId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          return songResponse.data;
        }),
      );
      return {
        playlist: {
          ...playlist,
          songs: songsWithDetails,
        },
        userData: playlist.userID
          ? {
              name: playlist.userID.name,
              email: playlist.userID.email,
            }
          : null,
      };
    }

    return {
      playlist,
      userData: playlist.userID
        ? {
            name: playlist.userID.name,
            email: playlist.userID.email,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw error;
  }
};

export {
  createPlaylist,
  addSongToPlaylist,
  addLikedSong,
  removeLikedSong,
  followArtist,
  unfollowArtist,
  removeLikedAlbum,
  getPlaylistById,
  removeSongFromPlaylist,
  updatePlaylistThumbnail,
  fetchPlaylistData,
};
