import React from 'react';

const PlaylistSection = ({ title }) => {
  return (
    <>
      <h2 className="text-xl mb-4 mt-8">{title}</h2>
      <div className="grid grid-cols-6 gap-4">
        <PlaylistCard image="./src/assets/img8.jpg" title="Top 50 Global" description="Your weekly update of the most played tracks" />
        <PlaylistCard image="./src/assets/img9.jpg" title="Top 50 India" description="Your weekly update of the most played tracks" />
        {/* Thêm các playlist card khác */}
      </div>
    </>
  );
};

const PlaylistCard = ({ image, title, description }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <img src={image} alt={title} className="rounded mb-2" />
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);

export default PlaylistSection;
