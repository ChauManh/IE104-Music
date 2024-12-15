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

const deletePlaylist = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }
    await axios.delete(`http://localhost:3000/user/playlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("API delete playlist error:", error);
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

const followArtist = async (artist) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }
    await axios.post(
      "http://localhost:3000/user/create_playlist",
      {
        name: artist.name,
        thumbnail: artist.images[0]?.url,
        type: "artist",
        artistId: artist.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // await axios.post(
    //   "http://localhost:3000/user/artists/follow",
    //   { artistId: artist.id },
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   },
    // );
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
    await axios.delete("http://localhost:3000/user/artists/unfollow", {
      headers: { Authorization: `Bearer ${token}` },
      data: { artistId },
    });
  } catch (error) {
    console.error("API unfollowArtist error:", error);
    throw error;
  }
};

const addLikedAlbum = async (album) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }
    await axios.post(
      "http://localhost:3000/user/create_playlist",
      {
        name: album.name,
        thumbnail: album.images[0]?.url,
        type: "album",
        albumId: album.id, // Store the album ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // await axios.post(
    //   "http://localhost:3000/user/albums/add",
    //   { albumId: album.id },
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   },
    // );
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
      `http://localhost:3000/user/playlist/${playlistId}/songs/${songId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
};

const updatePlaylist = async (id, name, description) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    return axios.put(
      `http://localhost:3000/user/playlist/${id}`,
      {
        name: name,
        description: description, // Make sure description is included
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.error("Error updating thumbnail:", error);
    throw error;
  }
};

const updatePlaylistThumbnail = async (playlistId, file) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const formData = new FormData();
    formData.append("thumbnail", file);

    return await axios.put(
      `http://localhost:3000/user/playlist/${playlistId}/thumbnail`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error) {
    console.error("Error updating thumbnail:", error);
    throw error;
  }
};

const updateProfile = async (name) => {
  const token = localStorage.getItem("access_token");
  await axios.put(
    "http://localhost:3000/user/update_profile",
    { name: name },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

const updateAvatar = async (formData) => {
  const token = localStorage.getItem("access_token");
  await axios.put("http://localhost:3000/user/update_avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const getProfile = async () => {
  const token = localStorage.getItem("access_token");
  return await axios.get("http://localhost:3000/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getPlaylists = async () => {
  const token = localStorage.getItem("access_token");
  return await axios.get("http://localhost:3000/user/get_playlists", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getRecentTracks = async () => {
  const token = localStorage.getItem("access_token");
  return await axios.get("http://localhost:3000/user/recent_tracks", {
    headers: { Authorization: `Bearer ${token}` },
  });
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
  deletePlaylist,
  addSongToPlaylist,
  addLikedSong,
  addLikedAlbum,
  getPlaylists,
  removeLikedSong,
  followArtist,
  unfollowArtist,
  removeLikedAlbum,
  getRecentTracks,
  getPlaylistById,
  removeSongFromPlaylist,
  updatePlaylistThumbnail,
  updateProfile,
  updateAvatar,
  getProfile,
  fetchPlaylistData,
  updatePlaylist,
};
