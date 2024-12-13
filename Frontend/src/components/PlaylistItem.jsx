import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';

const PlaylistItem = ({ playlist }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (playlist.type === 'artist') {
      navigate(`/artist/${playlist.artistId}`);
    } else if (playlist.type === 'album') {
      navigate(`/album/${playlist.albumId}`);
    } else {
      navigate(`/playlist/${playlist._id}`);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');

        if (playlist.type === 'artist') {
          // Delete artist playlist and unfollow artist
          await Promise.all([
            axios.delete(
              `http://localhost:3000/user/playlist/${playlist._id}`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            ),
            axios.delete(
              `http://localhost:3000/user/artists/unfollow`,
              {
                headers: { Authorization: `Bearer ${token}` },
                data: { artistId: playlist.artistId }
              }
            )
          ]);
        } else if (playlist.type === 'album') {
          // Delete album playlist and remove from library
          await Promise.all([
            axios.delete(
              `http://localhost:3000/user/playlist/${playlist._id}`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            ),
            axios.delete(
              `http://localhost:3000/user/albums/remove`,
              {
                headers: { Authorization: `Bearer ${token}` },
                data: { albumId: playlist.albumId }
              }
            )
          ]);
        } else {
          // Regular playlist deletion
          await axios.delete(
            `http://localhost:3000/user/playlist/${playlist._id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        }

        // Refresh sidebar
        window.dispatchEvent(new Event('playlistsUpdated'));
      } catch (error) {
        console.error('Error deleting:', error);
        window.dispatchEvent(new Event("playlistsUpdated"));
      }
    }
  };

  return (
    <div className="group flex justify-between items-center p-2 hover:bg-[#ffffff1a] rounded cursor-pointer">
      <div className="flex items-center gap-3" onClick={handleClick}>
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
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <img src={assets.remove_icon} alt="Delete" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PlaylistItem;