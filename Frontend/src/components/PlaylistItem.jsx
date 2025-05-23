import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { deletePlaylist, removeLikedAlbum, unfollowArtist } from '../services/userApi';

const PlaylistItem = ({ playlist }) => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleClick = () => {
    if (playlist.type === 'artist') {
      navigate(`/artist/${playlist.artistId}`);
    } else if (playlist.type === 'album') {
      navigate(`/album/${playlist.albumId}`);
    } else {
      navigate(`/playlist/${playlist._id}`, { replace: true });
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
     {
      try {
        if (playlist.type === 'artist') {
          await Promise.all([
            deletePlaylist(playlist._id),
            unfollowArtist(playlist.artistId)
          ]);
        } else if (playlist.type === 'album') {
          await Promise.all([
            deletePlaylist(playlist._id),
            removeLikedAlbum(playlist.albumId)
          ]);
        } else {
          deletePlaylist(playlist._id)
        }

        setNotificationMessage("Đã xóa playlist thành công");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        setTimeout(() => {
          navigate('/');
          window.dispatchEvent(new Event("playlistsUpdated"));
        }, 2000);


      } catch (error) {
        console.error('Error deleting:', error);
        setNotificationMessage("Không thể xóa playlist");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        window.dispatchEvent(new Event("playlistsUpdated"));
      }
    }
  };

  return (
    <>
      <div className="group flex justify-between items-center p-2 hover:bg-[#ffffff1a] rounded cursor-pointer" onClick={handleClick}>
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 bg-white opacity-90 rounded-3xl">
            <img
              src={playlist.thumbnail || assets.music_icon}
              alt={playlist.name}
              className="h-full w-full rounded-3xl object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-white truncate md:max-w-[185px]">{playlist.name}</p>
            <p className="text-sm text-[#b3b3b3]">
              {playlist.type === 'artist' ? 'Nghệ sĩ' : 
               playlist.type === 'album' ? 'Album' : 
               'Danh sách phát của bạn'}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <img src={assets.remove_icon} alt="Delete" className="w-4 h-4" />
        </button>
      </div>

      {showNotification && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="rounded-full bg-[#1ed760] px-4 py-2 text-center text-sm font-medium text-black shadow-lg">
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistItem;