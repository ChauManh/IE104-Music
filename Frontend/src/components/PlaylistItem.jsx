import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const PlaylistItem = ({ playlist }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log("Playlist type:", playlist.type); // Debug log
    console.log("Album ID:", playlist.albumId); // Debug log
    
    if (playlist.type === 'artist') {
      navigate(`/artist/${playlist.artistId}`);
    } else if (playlist.type === 'album') {
      navigate(`/album/${playlist.albumId}`);
    } else {
      navigate(`/playlist/${playlist._id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group flex cursor-pointer items-center justify-between rounded p-2 transition-colors hover:bg-[#ffffff1a]"
    >
      <div className="flex items-center gap-3 pr-2">
        <div className="relative h-10 w-10 bg-white opacity-90 rounded-3xl">
          <img
            src={playlist.thumbnail || assets.music_icon}
            alt={playlist.name}
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-medium text-white truncate max-w-48">{playlist.name}</p>
          <p className="text-sm text-[#b3b3b3]">
            {playlist.type === 'artist' ? 'Nghệ sĩ' : 
             playlist.type === 'album' ? 'Album' : 
             'Danh sách phát của bạn'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;