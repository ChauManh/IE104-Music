import React from 'react';
import { assets } from '../assets/assets'; // Import các assets

const Sidebar = () => {
  return (
    <div className="w-1/5 p-4">
      <h2 className="flex text-lg font-semibold mb-4 items-center">
        <img src={assets.stack_icon} alt="Library" className="w-5 h-5 mr-2" />
        My Library
        <img src={assets.loop_icon} alt="Loop" className="w-5 h-5 ml-20 hidden" />
        <img src={assets.loop_icon} alt="Loop" className="w-5 h-5 ml-2 hidden" />
      </h2>
      <ul className="space-y-3">
        <li>
          <a href="#" className="flex text-gray-300 hover:text-white items-center">
            <img src={assets.arrow_icon} alt="Arrow" className="w-5 h-5 mr-2" />
            Playlists
          </a>
        </li>
        <li>
          <a href="#" className="flex text-gray-300 hover:text-white items-center">
            <img src={assets.like_icon} alt="Liked Songs" className="w-5 h-5 mr-2" />
            Liked Songs
          </a>
        </li>
        {/* Thêm các mục khác tương tự */}
      </ul>
    </div>
  );
};

export default Sidebar;
