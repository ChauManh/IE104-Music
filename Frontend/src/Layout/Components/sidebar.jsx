import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { createPlaylist } from "../../util/api";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!localStorage.getItem("access_token")) {
        alert("Please login first to create a playlist");
        return;
      }

      const response = await createPlaylist();
      if (response) {
        alert(`Successfully created playlist: ${response.name}`);
        navigate(`/playlist/${response._id}`); // Navigate to the new playlist
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

  const navigateToPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  }; 
  return (
    <div
      className={`${isSidebarExpanded ? "min-w-[20%]" : "min-w-[40%]"} mt-16 hidden max-h-full flex-col gap-2 pl-2 pr-2 text-white transition-all duration-300 lg:flex`}
    >
      <div className="h-[100%] rounded-3xl bg-[#121212]">
        <div className="flex items-center justify-between p-4">
          <div className="flex cursor-default items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="" />
            <p className="font-semibold">Thư viện</p>
          </div>
          <div className="flex items-center gap-3">
            <img
              className="flex w-5 cursor-pointer rounded-full transition-transform duration-300 hover:scale-110"
              src={assets.plus_icon}
              alt=""
              title="Tạo danh sách phát và thư mục"
            />
            <img
              className="flex w-5 cursor-pointer rounded-full transition-transform duration-300 hover:scale-110"
              src={
                isSidebarExpanded ? assets.arrow_icon : assets.arrow_rotate_icon
              }
              alt=""
              onClick={toggleSidebar}
            />
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default Sidebar;
