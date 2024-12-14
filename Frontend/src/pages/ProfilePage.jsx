import React, { useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import ColorThief from "colorthief";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dominantColor, setDominantColor] = useState("#333333");
  const [editForm, setEditForm] = useState({
    name: "",
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [followedArtists, setFollowedArtists] = useState([]);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      if (editForm.avatar) {
        const formData = new FormData();
        formData.append("avatar", editForm.avatar);

        const avatarResponse = await axios.put(
          "http://localhost:3000/user/update_avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (avatarResponse.data.success) {
          // Update both local state and localStorage with complete user object
          const updatedUser = avatarResponse.data.user;
          setUserData(updatedUser); // This triggers a re-render
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Extract new color from updated avatar
          if (updatedUser.avatar) {
            extractColor(updatedUser.avatar);
          }

          // Dispatch custom event for avatar update
          window.dispatchEvent(new Event("avatarUpdated"));

          // Fetch fresh user data to ensure everything is in sync
          const userResponse = await axios.get(
            "http://localhost:3000/user/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          setUserData(userResponse.data.user);
        }
      }

      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize editForm when userData changes
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || "",
        avatar: null,
      });
    }
  }, [userData]);

  const extractColor = async (imageUrl) => {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      img.onload = () => {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setDominantColor(`rgb(${color.join(",")})`);
      };
    } catch (error) {
      console.error("Error extracting color:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Fetch current user data from server instead of localStorage
        const userResponse = await axios.get(
          "http://localhost:3000/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const userData = userResponse.data.user;

        // Update local storage with fresh data from server
        localStorage.setItem("user", JSON.stringify(userData));

        setUserData(userData);
        setEditForm({ name: userData.name, avatar: null });

        // Extract color from avatar if exists
        if (userData.avatar) {
          extractColor(userData.avatar);
        }

        // Fetch user's playlists
        const playlistsResponse = await axios.get(
          "http://localhost:3000/user/get_playlists",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Filter to only show playlists with type 'playlist'
        const userPlaylists = playlistsResponse.data.playlists.filter(
          (playlist) => playlist.type === "playlist",
        );
        setPlaylists(userPlaylists);

        // Fetch recent tracks
        const recentTracksResponse = await axios.get(
          "http://localhost:3000/user/recent_tracks",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (recentTracksResponse.data.tracks) {
          setRecentTracks(recentTracksResponse.data.tracks);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        // Fetch user's playlists
        const playlistsResponse = await axios.get(
          "http://localhost:3000/user/get_playlists",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Filter artist type playlists
        const artistPlaylists = playlistsResponse.data.playlists.filter(
          (playlist) => playlist.type === "artist",
        );

        // Get artist details for each followed artist
        const artistDetails = await Promise.all(
          artistPlaylists.map(async (playlist) => {
            try {
              const response = await axios.get(
                `http://localhost:3000/artist/${playlist.artistId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );
              return response.data;
            } catch (error) {
              console.error(
                `Error fetching artist ${playlist.artistId}:`,
                error,
              );
              return null;
            }
          }),
        );

        // Filter out any failed requests and set state
        setFollowedArtists(artistDetails.filter((artist) => artist !== null));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handlePlaylistClick = (playlistId) => {
    if (playlistId) {
      navigate(`/playlist/${playlistId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header section with gradient */}
      <div
        className="flex h-[340px] items-end p-8"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 0%, #121212 100%)`,
        }}
      >
        <div className="flex items-center gap-6">
          <div className="group relative">
            <img
              src={userData?.avatar || assets.avatar}
              alt="Profile"
              className="h-48 w-48 rounded-full object-cover shadow-2xl"
            />
            <button
              onClick={() => setShowEditDialog(true)}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span>Sửa thông tin</span>
            </button>
          </div>
          <div>
            <p className="mb-2 text-sm">Hồ sơ</p>
            <h1 className="text-6xl font-black">{userData?.name}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span>{playlists.length} Danh sách phát</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content section with gradient overlap */}
      <div
        className="px-8 py-6"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, #121212 100%)`,
        }}
      >
        {/* Playlists Section */}
        <section className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Danh sách phát của bạn</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => handlePlaylistClick(playlist._id)}
                className="group relative flex cursor-pointer flex-col items-center rounded-md bg-[#181818] p-4 transition-colors duration-300 hover:bg-[#282828]"
              >
                <div className="relative mb-4 w-full">
                  <div className="relative aspect-square w-full">
                    <img
                      src={playlist.thumbnail || assets.music_icon}
                      alt={playlist.name}
                      className="h-full w-full rounded-md object-cover shadow-lg"
                    />
                    {/* Play button overlay */}
                    <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] shadow-xl transition-transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add play functionality here if needed
                        }}
                      >
                        <img
                          src={assets.play_icon}
                          alt="Play"
                          className="h-6 w-6"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <h3 className="mb-2 truncate text-base font-bold">
                    {playlist.name}
                  </h3>
                  <p className="truncate text-sm text-[#b3b3b3]">
                    {playlist.type === "artist"
                      ? "Artist"
                      : playlist.type === "album"
                        ? "Album"
                        : "Playlist"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Tracks Section
                <section>
                    <h2 className="mb-6 text-2xl font-bold">Nghe gần đây</h2>
                    {recentTracks.length > 0 ? (
                        <div className="grid gap-2">
                            {recentTracks.map((track, index) => (
                                <div 
                                    key={track._id}
                                    className="group grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 rounded-md px-4 py-2 text-sm hover:bg-[#ffffff1a] cursor-pointer"
                                >
                                    <span className="flex items-center text-[#b3b3b3]">
                                        {index + 1}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={track.image}
                                            alt={track.title}
                                            className="h-10 w-10 rounded"
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="truncate text-white">
                                                {track.title}
                                            </span>
                                            <span className="truncate text-[#b3b3b3]">
                                                {track.artistName}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="flex items-center text-[#b3b3b3]">
                                        {track.album || "Unknown Album"}
                                    </span>
                                    <span className="flex items-center text-[#b3b3b3]">
                                        {formatDate(track.createdAt)}
                                    </span>
                                    <span className="flex items-center justify-end text-[#b3b3b3]">
                                        {Math.floor(track.duration / 60000)}:
                                        {String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#b3b3b3]">No recent tracks</p>
                    )}
                </section> */}

        {/* Followed Artists Section */}
        <section className="mt-6">
          <h2 className="mb-4 text-2xl font-bold">Nghệ sĩ đã theo dõi</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {followedArtists.map((artist) => (
              <div
                key={artist.id}
                className="group relative cursor-pointer rounded-md bg-[#181818] p-4 transition-all duration-300 hover:bg-[#282828]"
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                <img
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className="mb-4 aspect-square w-full rounded-full object-cover"
                />
                <h3 className="mb-1 truncate text-base font-bold">
                  {artist.name}
                </h3>
                <p className="text-sm text-[#a7a7a7]">Nghệ sĩ</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      {showEditDialog && (
        <EditProfileDialog
          userData={userData}
          editForm={editForm}
          setEditForm={setEditForm}
          handleUpdateProfile={handleUpdateProfile}
          onClose={() => setShowEditDialog(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

const EditProfileDialog = ({
  userData,
  editForm,
  setEditForm,
  handleUpdateProfile,
  onClose,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[500px] rounded-lg bg-[#282828] p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">Edit Profile</h2>
        <div className="mb-6 flex gap-4">
          <div className="relative h-48 w-48">
            <img
              src={
                editForm.avatar
                  ? URL.createObjectURL(editForm.avatar)
                  : userData?.avatar || assets.avatar
              }
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-all hover:opacity-100">
              <label className="cursor-pointer text-center">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditForm((prev) => ({
                        ...prev,
                        avatar: file,
                      }));
                    }
                  }}
                  disabled={isLoading}
                />
                <img
                  src={assets.plus_icon}
                  alt="Change avatar"
                  className="mx-auto mb-2 h-8 w-8"
                />
                <p className="text-sm">Choose Image</p>
              </label>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a7a7a7]">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded bg-[#3e3e3e] p-2 text-white focus:outline-none"
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-full px-8 py-2 text-white hover:bg-[#ffffff1a]"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProfile}
            className="rounded-full bg-[#1ed760] px-8 py-2 font-semibold text-black hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
