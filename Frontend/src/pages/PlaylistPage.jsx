import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import ColorThief from "colorthief";
import axios from "axios";
import AlbumItem from "../components/AlbumItem"; // Add this import
<<<<<<< HEAD
import {
  fetchPlaylistData,
  addSongToPlaylist,
  removeSongFromPlaylist,
  updatePlaylistThumbnail,
  searchContent,
  getTrack,
  getIdSpotifFromSongId,
} from "../util/api";
=======

// Add this function at the top of your PlaylistPage component
const searchContent = async (query) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`http://localhost:3000/search`, {
      params: {
        q: query,
        type: 'track,artist,album'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    return {
      tracks: { items: [] },
      artists: { items: [] },
      albums: { items: [] }
    };
  }
};
>>>>>>> 38e4a7d4e765c215d0df1f6799f60e080c2af068

const PlaylistPage = () => {
  const token = localStorage.getItem('access_token');
  const { id } = useParams();

  // If this is the liked songs playlist, render the LikedSongsPlaylist component
  if (id === 'liked') {
    return <LikedSongsPlaylist token={token} />;
  }

  const navigate = useNavigate();
  const { playWithUri, track, setTrack } = useContext(PlayerContext);
  const [dominantColor, setDominantColor] = useState("#333333");
  const [secondaryColor, setSecondaryColor] = useState("#121212");
  const [playlistData, setPlaylistData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
  });
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);

  const handlePlayTrack = async (id) => {
    try {
        const spotifyId = await getIdSpotifFromSongId(id);
        const response = await getTrack(spotifyId); 
        setTrack(response); 
        playWithUri(response.uri); 
    } catch (error) {
        console.error("Error handling play track:", error);
    }
  };  

  // Update the Notification component styling
  const Notification = ({ message }) => (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="rounded-full bg-[#1ed760] px-4 py-2 text-center text-sm font-medium text-black shadow-lg">
        <span>{message}</span>
      </div>
    </div>
  );

  // Add new function to check if song is already in playlist
  const isSongInPlaylist = (trackId) => {
    return playlistSongs.some((song) => song.spotifyId === trackId);
  };

  // Add function to check if playlist exists
  const isPlaylistExists = async (playlistName) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        "http://localhost:3000/user/get_playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if a playlist with this name already exists
      return response.data.playlists.some(
        (playlist) => playlist.name === playlistName
      );
    } catch (error) {
      console.error("Error checking playlist existence:", error);
      return false;
    }
  };

  const handleFollowAlbum = async (album) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login first to follow album");
      return;
    }

    // Check if album playlist already exists
    const playlistsResponse = await axios.get(
      "http://localhost:3000/user/get_playlists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const exists = playlistsResponse.data.playlists.some(
      (playlist) => playlist.type === 'album' && playlist.albumId === album.id
    );

    if (exists) {
      alert("Album already in your library");
      return;
    }

    // Create new album playlist
    const createPlaylistResponse = await axios.post(
      "http://localhost:3000/user/create_playlist",
      { 
        name: album.name,
        thumbnail: album.images[0]?.url,
        type: 'album',
        albumId: album.id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Show notification
    setNotificationMessage(`Đã thêm ${album.name} vào thư viện`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
    window.dispatchEvent(new Event('playlistsUpdated'));

  } catch (error) {
    console.error("Error following album:", error);
    alert("Failed to add album to library");
  }
};

  const handleAddToPlaylist = async (trackId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      // First create/get song in database with album name
      let songResponse;
      try {
        songResponse = await axios.post(
          "http://localhost:3000/songs/create",
          {
            spotifyId: trackId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Get the MongoDB _id from the created/existing song
        const songId = songResponse.data.song._id;

        // Add song to playlist using MongoDB _id
        const response = await axios.post(
          "http://localhost:3000/user/playlist/add_song",
          {
            playlistID: id,
            songID: songId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.message === "Song added to playlist successfully.") {
          // Show notification
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 2000); // Hide after 2 seconds

          // Fetch updated playlist data including new song
          const updatedPlaylistResponse = await axios.get(
            `http://localhost:3000/user/playlist/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const { playlist } = updatedPlaylistResponse.data;
          setPlaylistData(playlist);

          // Fetch details for all songs including the new one
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
            setPlaylistSongs(songsWithDetails);

            // Filter out the added song from search results
            setSearchResults((prev) => ({
              ...prev,
              tracks: prev.tracks.filter((track) => track.id !== trackId),
            }));
          }
        }
      } catch (err) {
        console.error("Error creating/adding song:", err);
        throw err;
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Không thể thêm bài hát vào playlist",
      );
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.delete(
        `http://localhost:3000/user/playlist/${id}/songs/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Song removed from playlist successfully.") {
        setPlaylistSongs((prev) => prev.filter((song) => song._id !== songId));
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }
    } catch (error) {
      console.error("Error removing song:", error);
      alert(
        error.response?.data?.message || "Không thể xóa bài hát khỏi playlist"
      );
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsThumbnailLoading(true);
      try {
        const formData = new FormData();
        formData.append("thumbnail", file);

        const token = localStorage.getItem("access_token");
        const response = await axios.put(
          `http://localhost:3000/user/playlist/${id}/thumbnail`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.playlist) {
          setPlaylistData(response.data.playlist);
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        alert("Failed to update playlist thumbnail");
      } finally {
        setIsThumbnailLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchPlaylistData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          `http://localhost:3000/user/playlist/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { playlist } = response.data;
        setPlaylistData(playlist);

        // Get user data
        const userData = JSON.parse(localStorage.getItem("user"));
        setUserData(userData);

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
                }
              );
              return songResponse.data;
            })
          );
          setPlaylistSongs(songsWithDetails);

          // Update playlist description with stats
          const totalDuration = calculateTotalDuration(songsWithDetails);
          const playlistDescription = `${userData?.name} • ${songsWithDetails.length} bài hát, ${totalDuration}`;
          setPlaylistData(prev => ({
            ...prev,
            description: playlistDescription
          }));
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPlaylistData();
    }
  }, [id]);

  // Add calculateTotalDuration helper function
  const calculateTotalDuration = (songs) => {
    const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0);
    const minutes = Math.floor(totalDuration / 60000);
    const seconds = Math.floor((totalDuration % 60000) / 1000);
    return `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;
  };

  // Update the useEffect for search
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.length > 0) {
        setIsSearching(true);
        try {
          const data = await searchContent(searchQuery);
          const filteredTracks =
            data.tracks?.items.filter((track) => !isSongInPlaylist(track.id)) ||
            [];

          setSearchResults({
            tracks: filteredTracks,
            artists: data.artists?.items || [],
            albums: data.albums?.items || [],
          });
        } catch (error) {
          setSearchResults({ tracks: [], artists: [], albums: [] });
        }
        setIsSearching(false);
      } else {
        setSearchResults({ tracks: [], artists: [], albums: [] });
        // ... reset other states
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [searchQuery, playlistSongs]);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleArtistClick = async (artist) => {
    try {
      setIsSearching(true);
      setSelectedArtist(artist);

      // Fetch artist's tracks and albums
      const [tracksResponse, albumsResponse] = await Promise.all([
        axios.get(`http://localhost:3000/artist/${artist.id}/top-tracks`),
        axios.get(`http://localhost:3000/artist/${artist.id}/albums`),
      ]);

      setArtistTracks(tracksResponse.data.tracks || []);
      setArtistAlbums(albumsResponse.data.items || []);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching artist content:", error);
      setIsSearching(false);
    }
  };

  // Update the handleAlbumClick function
  const handleAlbumClick = async (album) => {
    try {
      setIsSearching(true);
      setSelectedAlbum(album);
      setSelectedArtist(null); // Clear artist selection
      setArtistTracks([]); // Clear artist tracks
      setArtistAlbums([]); // Clear artist albums

      // Fetch album tracks
      const tracksResponse = await axios.get(
        `http://localhost:3000/album/${album.id}/tracks`,
      );

      setAlbumTracks(tracksResponse.data || []);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching album content:", error);
      setIsSearching(false);
    }
  };

  // Update the handleBackClick function
  const handleBackClick = () => {
    if (selectedAlbum) {
      // If in album view, go back to artist view
      setSelectedAlbum(null);
      setAlbumTracks([]);
      // Restore artist view if coming from artist
      if (selectedArtist) {
        const fetchArtistContent = async () => {
          try {
            setIsSearching(true);
            const [tracksResponse, albumsResponse] = await Promise.all([
              axios.get(
                `http://localhost:3000/artist/${selectedArtist.id}/top-tracks`,
              ),
              axios.get(
                `http://localhost:3000/artist/${selectedArtist.id}/albums`,
              ),
            ]);
            setArtistTracks(tracksResponse.data.tracks || []);
            setArtistAlbums(albumsResponse.data.items || []);
            setIsSearching(false);
          } catch (error) {
            console.error("Error fetching artist content:", error);
            setIsSearching(false);
          }
        };
        fetchArtistContent();
      }
    } else {
      // If in artist view, go back to search results
      setSelectedArtist(null);
      setArtistTracks([]);
      setArtistAlbums([]);
    }
  };

  // Search Results Section
  const SearchResults = () => (
    <div className="mt-6">
      {isSearching ? (
        <p className="text-[#727272]">Đang tìm kiếm...</p>
      ) : (
        <>
          {selectedArtist || selectedAlbum ? (
            <>
              {/* Back Button Section */}
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-white hover:text-[#1ed760]"
                >
                  <img src={assets.arrow_left} alt="Back" className="h-5 w-5" />
                  <span className="text-lg font-bold">
                    {selectedAlbum ? selectedAlbum.name : selectedArtist?.name}
                  </span>
                </button>
              </div>

              {/* Album Tracks */}
              {selectedAlbum && (
                <div className="mb-8">
                  <div className="grid gap-2">
                    {albumTracks.map((track) => (
                      <div
                        key={track.id}
                        className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                      >
                        <img
                          src={selectedAlbum.images[2].url}
                          alt={track.name}
                          className="h-10 w-10 rounded"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="text-white">{track.name}</p>
                          <p className="text-sm text-[#a7a7a7]">
                            {track.artists
                              ?.map((artist) => artist.name)
                              .join(", ")}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlaylist(track.id);
                          }}
                          className="rounded-full border border-white bg-transparent px-4 py-1 text-sm opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artist Content - Only show if no album is selected */}
              {selectedArtist && !selectedAlbum && (
                <>
                  {/* Artist's Tracks */}
                  {artistTracks.length > 0 && (
                    <div className="mb-8">
                      <h3 className="mb-4 text-lg font-bold">
                        Những bài hát phổ biến
                      </h3>
                      <div className="grid gap-2">
                        {artistTracks.map((track) => (
                          <div
                            key={track.id}
                            className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                          >
                            <img
                              src={track.album.images[2].url}
                              alt={track.name}
                              className="h-10 w-10 rounded"
                            />
                            <div className="flex flex-1 flex-col">
                              <p className="text-white">{track.name}</p>
                              <p className="text-sm text-[#a7a7a7]">
                                {track.album.name}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToPlaylist(track.id);
                              }}
                              className="rounded-full border border-white bg-transparent px-4 py-1 text-sm opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                            >
                              Thêm
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Artist's Albums - Updated to match track item style */}
                  {artistAlbums.length > 0 && (
                    <div className="mb-8">
                      <h3 className="mb-4 text-lg font-bold">Albums</h3>
                      <div className="grid gap-2">
                        {artistAlbums.map((album) => (
                          <div
                            key={album.id}
                            onClick={() => handleAlbumClick(album)}
                            className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                          >
                            <img
                              src={album.images[2].url}
                              alt={album.name}
                              className="h-10 w-10 rounded"
                            />
                            <div className="flex flex-1 flex-col">
                              <p className="text-white">{album.name}</p>
                              <p className="text-sm text-[#a7a7a7]">
                                {album.artists[0]?.name} •{" "}
                                {album.release_date?.slice(0, 4)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            // Initial Search Results
            <>
              {/* Single Artist Result */}
              {searchResults.artists.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-bold">Nghệ sĩ</h3>
                  <div
                    onClick={() => handleArtistClick(searchResults.artists[0])}
                    className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                  >
                    <img
                      src={
                        searchResults.artists[0].images[0]?.url || assets.avatar
                      }
                      alt={searchResults.artists[0].name}
                      className="h-10 w-10 rounded"
                    />
                    <div className="flex flex-1 flex-col">
                      <p className="text-white">
                        {searchResults.artists[0].name}
                      </p>
                      <p className="text-sm text-[#a7a7a7]">Nghệ sĩ</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tracks Results */}
              {searchResults.tracks.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-4 text-lg font-bold">Bài hát</h3>
                  <div className="grid gap-2">
                    {searchResults.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                      >
                        <img
                          src={track.album.images[2].url}
                          alt={track.name}
                          className="h-10 w-10 rounded"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="text-white">{track.name}</p>
                          <p className="text-sm text-[#a7a7a7]">
                            {track.artists[0].name}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlaylist(track.id);
                          }}
                          className="rounded-full border border-white bg-transparent px-4 py-1 text-sm opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Albums Results */}
              {searchResults.albums.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-4 text-lg font-bold">Albums</h3>
                  <div className="grid gap-2">
                    {searchResults.albums.map((album) => (
                      <div
                        key={album.id}
                        onClick={() => handleAlbumClick(album)}
                        className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                      >
                        <img
                          src={album.images[2].url}
                          alt={album.name}
                          className="h-10 w-10 rounded"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="text-white">{album.name}</p>
                          <p className="text-sm text-[#a7a7a7]">
                            {album.artists[0]?.name} •{" "}
                            {album.release_date?.slice(0, 4)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put(
        `http://localhost:3000/user/playlist/${id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        // Update local state immediately
        setPlaylistData(prev => ({
          ...prev,
          name: editFormData.name,
          description: editFormData.description
        }));

        // Close dialog and show notification
        setShowEditDialog(false);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
      alert("Không thể cập nhật thông tin playlist");
    }
  };

  const handleTitleClick = () => {
    setEditFormData({
      name: playlistData?.name || "",
      description: playlistData?.description || "",
    });
    setShowEditDialog(true);
  };

  return (
    <div className="relative w-full bg-[#121212] text-white">
      {/* Header section */}
      <div
        className="flex h-[240px] items-end p-4 sm:h-[280px] sm:p-6 md:h-[340px] md:p-8"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 5%, ${secondaryColor} 90%)`,
        }}
      >
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
          <div className="relative group">
            <img
              src={playlistData?.thumbnail || assets.plus_icon}
              alt="Playlist Cover"
              className="h-40 w-40 rounded-md shadow-2xl md:h-60 md:w-60 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
              <label className="cursor-pointer">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <div className="text-white text-center">
                  <img 
                    src={assets.plus_icon} 
                    alt="Change thumbnail" 
                    className="w-8 h-8 mx-auto mb-2"
                  />
                  <p className="text-sm">Chọn ảnh</p>
                </div>
              </label>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs font-normal sm:text-sm md:text-base">
              Playlist
            </p>
            <h1
              className="mb-1 cursor-pointer text-2xl font-black sm:mb-2 sm:text-3xl md:mb-3 xl:text-6xl 2xl:text-7xl"
              onClick={handleTitleClick}
            >
              {playlistData?.name || "My Playlist"}
            </h1>
            {playlistData?.description && (
              <p className="mb-2 text-sm text-[#b3b3b3] sm:text-base md:mb-4">
                {playlistData.description}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium sm:text-base">
                {userData?.name}
              </span>
              {playlistSongs.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#b3b3b3] sm:text-sm">
                    • {playlistSongs.length} bài hát,
                  </span>
                  <span className="text-xs text-[#b3b3b3] sm:text-sm">
                    {calculateTotalDuration(playlistSongs)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div
        className="relative px-8 pb-12"
        style={{
          background: `linear-gradient(to bottom, ${secondaryColor} 0%, #121212 100%)`,
        }}
      >
        <div className="flex items-center gap-8">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] hover:scale-105 hover:bg-[#1fdf64]">
            <img className="h-8 w-8" src={assets.play_icon} alt="Play" />
          </button>
        </div>
<<<<<<< HEAD
  
        {/* Playlist Songs Section */}
        <div className="px-8 py-6">
          {playlistSongs.length > 0 && (
            <div className="mb-8">
              {/* Headers */}
              <div className="hidden grid-cols-[16px_4fr_3fr_2fr_1fr_80px] gap-4 px-4 py-2 text-sm text-[#b3b3b3] md:grid">
                <span className="flex items-center">#</span>
                <span className="flex items-center">Tiêu đề</span>
                <span className="hidden items-center sm:flex">Album</span>
                <span className="hidden items-center md:flex">Ngày thêm</span>
                <div className="flex items-center justify-end">
                  <img
                    src={assets.clock_icon}
                    alt="Duration"
                    className="h-5 w-5"
                  />
                </div>
                <span></span> {/* Empty space for delete button column */}
              </div>
  
              <hr className="my-2 border-t border-[#2a2a2a]" />
  
              {/* Song List */}
              <div className="mt-4 flex flex-col gap-2">
                {playlistSongs.map((song, index) => (
                  <div
                    key={song._id}
                    className="group grid grid-cols-[16px_1fr_80px] gap-4 rounded-md px-4 py-2 text-sm hover:bg-[#ffffff1a] sm:grid-cols-[16px_4fr_3fr_80px] md:grid-cols-[16px_4fr_3fr_2fr_1fr_80px] cursor-pointer"
                    onClick={() => handlePlayTrack(song._id)}
                  >
                    <span className="flex items-center text-[#b3b3b3]">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src={song.image}
                        alt={song.title}
                        className="h-10 w-10 rounded"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="max-w-[200px] truncate text-white sm:max-w-[300px] md:max-w-[450px]">
                          {song.title}
                        </span>
                        <span className="truncate text-[#b3b3b3]">
                          {song.artistName}
                        </span>
                      </div>
                    </div>
                    <span className="hidden items-center overflow-hidden truncate text-[#b3b3b3] sm:flex">
                      {song.album || "Unknown Album"}
                    </span>
                    <span className="hidden items-center text-[#b3b3b3] md:flex">
                      {formatDate(song.createdAt)}
                    </span>
                    <div className="hidden items-center justify-end text-[#b3b3b3] md:flex">
                      {formatDuration(song.duration)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSong(song._id);
                      }}
                      className="rounded-full border border-white bg-transparent px-4 py-1 text-sm text-white opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
=======
      </div>

      {/* Playlist Songs Section */}
      <div className="px-8 py-6">
        {playlistSongs.length > 0 && (
          <div className="mb-8">
            {/* Headers */}
            <div className="hidden grid-cols-[16px_4fr_3fr_2fr_1fr_80px] gap-4 px-4 py-2 text-sm text-[#b3b3b3] md:grid">
              <span className="flex items-center">#</span>
              <span className="flex items-center">Tiêu đề</span>
              <span className="hidden items-center sm:flex">Album</span>
              <span className="hidden items-center md:flex">Ngày thêm</span>
              <div className="flex items-center justify-end">
                <img
                  src={assets.clock_icon}
                  alt="Duration"
                  className="h-5 w-5"
                />
>>>>>>> 38e4a7d4e765c215d0df1f6799f60e080c2af068
              </div>
              <span></span> {/* Empty space for delete button column */}
            </div>

            <hr className="my-2 border-t border-[#2a2a2a]" />

            {/* Song List */}
            <div className="mt-4 flex flex-col gap-2">
              {playlistSongs.map((song, index) => (
                <div
                  key={song._id}
                  className="group grid grid-cols-[16px_1fr_80px] gap-4 rounded-md px-4 py-2 text-sm hover:bg-[#ffffff1a] sm:grid-cols-[16px_4fr_3fr_80px] md:grid-cols-[16px_4fr_3fr_2fr_1fr_80px]"
                >
                  <span className="flex items-center text-[#b3b3b3]">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="h-10 w-10 rounded"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="max-w-[200px] truncate text-white sm:max-w-[300px] md:max-w-[450px]">
                        {song.title}
                      </span>
                      <span className="truncate text-[#b3b3b3]">
                        {song.artistName}
                      </span>
                    </div>
                  </div>
                  <span className="hidden items-center overflow-hidden truncate text-[#b3b3b3] sm:flex">
                    {song.album || "Unknown Album"}
                  </span>
                  <span className="hidden items-center text-[#b3b3b3] md:flex">
                    {formatDate(song.createdAt)}
                  </span>
                  <div className="hidden items-center justify-end text-[#b3b3b3] md:flex">
                    {formatDuration(song.duration)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSong(song._id);
                    }}
                    className="rounded-full border border-white bg-transparent px-4 py-1 text-sm text-white opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">
            Hãy cùng tìm nội dung cho danh sách của bạn
          </h2>
          <div className="relative w-full max-w-[364px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài hát hoặc nghệ sĩ yêu thích"
              className="w-full rounded-full bg-[#242424] px-12 py-3 text-sm text-white placeholder-[#727272] outline-none focus:outline-2 focus:outline-white"
            />
            <img
              src={assets.search_icon}
              alt="Search"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-60"
            />
          </div>

          {/* Only show search results if there's a query */}
          {searchQuery && <SearchResults />}
        </div>
      </div>
      {showNotification && (
        <Notification message={`Đã thêm vào ${playlistData?.name}`} />
      )}
      {showEditDialog && (
        <EditPlaylistDialog
          playlistData={playlistData}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleThumbnailUpload={handleThumbnailUpload}
          handleSaveChanges={handleSaveChanges}
          setShowEditDialog={setShowEditDialog}
        />
      )}
    </div>
  );
};

// Move EditPlaylistDialog outside main component to prevent re-rendering
const EditPlaylistDialog = ({ 
  playlistData, 
  editFormData, 
  setEditFormData, 
  handleThumbnailUpload, 
  handleSaveChanges, 
  setShowEditDialog 
}) => {
  const handleNameChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[500px] rounded-lg bg-[#282828] p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Chỉnh sửa thông tin
        </h2>
        <div className="mb-6 flex gap-4">
          <div className="relative h-48 w-48">
            <img
              src={playlistData?.thumbnail || assets.plus_icon}
              alt="Playlist Cover"
              className="h-full w-full rounded-md object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 opacity-0 transition-all hover:opacity-100">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <div className="text-center text-white">
                  <img
                    src={assets.plus_icon}
                    alt="Change thumbnail"
                    className="mx-auto mb-2 h-8 w-8"
                  />
                  <p>Chọn ảnh</p>
                </div>
              </label>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a7a7a7]">Tên</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={handleNameChange}
                className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                placeholder="Tên playlist"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a7a7a7]">
                Mô tả
              </label>
              <textarea
                value={editFormData.description}
                onChange={handleDescriptionChange}
                className="h-20 w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                placeholder="Thêm mô tả tùy chọn"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowEditDialog(false)}
            className="rounded-full px-8 py-2 text-white hover:bg-[#ffffff1a]"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveChanges}
            className="rounded-full bg-[#1ed760] px-8 py-2 font-semibold text-black hover:scale-105"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
