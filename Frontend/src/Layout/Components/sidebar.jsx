import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import PlaylistItem from "../../components/PlaylistItem";
import axios from "axios";
import { createPlaylist } from "../../util/api";
import { useNavigate } from "react-router-dom";

// Export the function to be used by other components
export const refreshPlaylists = async (setPlaylists) => {
  const token = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");

  if (!token || !user) return;

  try {
    const response = await axios.get(
      "http://localhost:3000/user/get_playlists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.playlists) {
      setPlaylists(response.data.playlists);
    }
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
};

// In sidebar.jsx
export const refreshApp = () => {
  window.dispatchEvent(new Event("appStateUpdated"));
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchPlaylists = async () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      setIsLoggedIn(false);
      setPlaylists([]);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/user/get_playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.playlists) {
        setPlaylists(response.data.playlists);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  // Update useEffect to check login status more reliably
  useEffect(() => {
    const checkLoginAndFetchPlaylists = async () => {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("user");

      console.log("Token:", token); // Debug log
      console.log("User:", user); // Debug log

      if (token && user) {
        setIsLoggedIn(true);
        try {
          const response = await axios.get(
            "http://localhost:3000/user/get_playlists",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.data.playlists) {
            setPlaylists(response.data.playlists);
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
          // If we get a 401 error, the token is invalid
          if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
          }
        }
      } else {
        setIsLoggedIn(false);
        setPlaylists([]);
      }
    };

    checkLoginAndFetchPlaylists();

    const handlePlaylistsUpdate = () => {
      checkLoginAndFetchPlaylists();
    };

    window.addEventListener("playlistsUpdated", handlePlaylistsUpdate);
    window.addEventListener("storage", checkLoginAndFetchPlaylists);

    return () => {
      window.removeEventListener("playlistsUpdated", handlePlaylistsUpdate);
      window.removeEventListener("storage", checkLoginAndFetchPlaylists);
    };
  }, []);

  const handleCreatePlaylist = async () => {
    if (!isLoggedIn) {
      alert("Please login first to create a playlist");
      navigate("/signin");
      return;
    }

    try {
      const response = await createPlaylist();
      if (response) {
        // Fetch all playlists again to ensure sidebar is up to date
        await fetchPlaylists();
        navigate(`/playlist/${response._id}`);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        setPlaylists([]);
        alert("Please login again to create playlist");
        navigate("/signin");
      } else {
        alert("Failed to create playlist. Please try again.");
      }
    }
  };

  return (
    <div
      className={`${isSidebarExpanded ? "min-w-[20%]" : "min-w-[40%]"} mt-16 hidden max-h-full flex-col gap-2 pl-2 pr-2 text-white transition-all duration-300 lg:flex`}
    >
      <div className="relative h-[100%] overflow-y-auto rounded-lg bg-[#121212]">
        {/* Sticky Header with Shadow */}
        <div className="sticky top-0 z-10 bg-[#121212] p-4 shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between">
            {/* Rest of header content remains the same */}
            <div className="flex cursor-default items-center gap-3">
              <img className="w-8" src={assets.stack_icon} alt="" />
              <p className="font-semibold">Thư viện</p>
            </div>
            {isLoggedIn && (
              <div className="flex items-center gap-3">
                <img
                  onClick={handleCreatePlaylist}
                  className="flex w-5 cursor-pointer rounded-full transition-transform duration-300 hover:scale-110"
                  src={assets.plus_icon}
                  alt=""
                  title="Tạo danh sách phát và thư mục"
                />
                <img
                  className="flex w-5 cursor-pointer rounded-full transition-transform duration-300 hover:scale-110"
                  src={
                    isSidebarExpanded
                      ? assets.arrow_icon
                      : assets.arrow_rotate_icon
                  }
                  alt=""
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Playlist Content */}
        {isLoggedIn ? (
          playlists.length === 0 ? (
            <div className="m-2 flex flex-col items-start justify-start gap-1 rounded bg-[#242424] p-4 pl-4 font-semibold">
              <h1>Tạo danh sách phát đầu tiên của bạn</h1>
              <p className="font-light">Rất dễ! Chúng tôi sẽ giúp bạn</p>
              <button
                onClick={handleCreatePlaylist}
                className="mt-4 rounded-full bg-white px-4 py-1.5 text-[15px] text-black"
              >
                Tạo danh sách phát
              </button>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-2 p-2">
              {playlists.map((playlist) => (
                <PlaylistItem key={playlist._id} playlist={playlist} />
              ))}
            </div>
          )
        ) : (
          <div className="m-2 flex flex-col items-start justify-start gap-1 rounded bg-[#242424] p-4 pl-4 font-semibold">
            <h1>Đăng nhập để tạo và xem playlist</h1>
            <button
              onClick={() => navigate("/signin")}
              className="mt-4 rounded-full bg-white px-4 py-1.5 text-[15px] text-black"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
