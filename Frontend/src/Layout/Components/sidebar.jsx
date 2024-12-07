import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { createPlaylist } from "../../util/api";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/get_playlists", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    try {
      if (!localStorage.getItem("access_token")) {
        alert("Please login first to create a playlist");
        return;
      }

      const response = await createPlaylist();
      if (response) {
        alert(`Successfully created playlist: ${response.name}`);
        // Add new playlist to state
        setPlaylists(prev => [...prev, response]);
        navigate(`/playlist/${response._id}`);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      if (error.response?.status === 401) {
        alert("Please login again to create playlist");
      } else {
        alert("Failed to create playlist. Please try again.");
      }
    }
  };

  return (
    <div className={`${isSidebarExpanded ? "min-w-[20%]" : "min-w-[40%]"} mt-16 hidden max-h-full flex-col gap-2 pl-2 pr-2 text-white transition-all duration-300 lg:flex`}>
      <div className="h-[100%] rounded-3xl bg-[#121212]">
        {/* Existing header */}
        <div className="flex items-center justify-between p-4">
          {/* ... existing header code ... */}
        </div>

        {playlists.length === 0 ? (
          // Show create playlist prompt if no playlists exist
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
          // Show playlist list if playlists exist
          <div className="mt-2 flex flex-col gap-2 p-2">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="flex items-center gap-3 rounded p-2 hover:bg-[#ffffff1a] cursor-pointer"
              >
                <img src={assets.plus_icon} alt="" className="w-12 h-12 rounded" />
                <div>
                  <p className="font-medium">{playlist.name}</p>
                  <p className="text-sm text-[#b3b3b3]">Playlist</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
