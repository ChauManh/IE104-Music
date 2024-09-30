import React from 'react';
import { albumsData, songsData } from '../assets/assets';

const MainContent = () => {
  return (
    <div className="flex-1 flex flex-col pt-12 mt-4 w-[100%]">
      <div className="border border-white border-opacity-20 rounded-lg relative">
        <TopSubNavbar />
        <div className="pl-6 pr-6 main-content pb-32">
          {/* Render albums */}
          <PlaylistSection title="Albums" data={albumsData} />
          {/* Render songs */}
          <PlaylistSection title="Songs" data={songsData} />
        </div>
      </div>
    </div>
  );
};

const TopSubNavbar = () => (
  <div className="flex space-x-4 fixed pl-6 bg-black-translucent h-16 items-center w-[77%] rounded-md">
    <NavbarButton label="All" active />
    <NavbarButton label="Music" />
    <NavbarButton label="Podcasts" />
    <NavbarButton label="AudioBooks" />
  </div>
);

const NavbarButton = ({ label, active }) => (
  <button
    className={`pl-3 pr-3 pt-2 pb-2 rounded-md ${
      active ? 'bg-white text-black' : 'bg-[#1f1f1f] text-white'
    } hover:opacity-80`}
  >
    {label}
  </button>
);

// PlaylistSection sẽ render albums hoặc songs từ props data
const PlaylistSection = ({ title, data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl mb-4">{title}</h2>
      <div className="grid grid-cols-4 gap-4">
        {data.map((item) => (
          <div key={item.id} className="bg-[#1f1f1f] p-4 rounded-md hover:opacity-80">
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md mb-4" />
            <h3 className="text-white text-lg">{item.name}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
            {item.duration && <p className="text-gray-400 text-sm">Duration: {item.duration}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
