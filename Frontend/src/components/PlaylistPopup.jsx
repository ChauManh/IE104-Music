import React, { useCallback } from 'react';
import { assets } from '../assets/assets';
import { addSongToPlaylist } from '../services/userApi';
const PlaylistPopup = ({ isOpen, onClose, trackId, playlists, setShowNotification, setNotificationMessage }) => {
    if (!isOpen) return null;

    const handleAddToPlaylist = useCallback(async (playlistId) => {
        try {
            await addSongToPlaylist(playlistId,trackId)

            setShowNotification(true);
            setNotificationMessage("Đã thêm vào playlist");
            setTimeout(() => setShowNotification(false), 2000);
            onClose();

        } catch (error) {
            console.error("Error adding song to playlist:", error);
        }
    }, [trackId, setShowNotification, setNotificationMessage, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[70vh] w-[400px] overflow-y-auto rounded-lg bg-[#282828] p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Add to Playlist</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-white hover:text-gray-400"
                    >
                        ×
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            onClick={() => handleAddToPlaylist(playlist._id)}
                            className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-[#ffffff1a]"
                        >
                            <img
                                src={playlist.thumbnail || assets.music_icon}
                                alt={playlist.name}
                                className="h-12 w-12 rounded object-cover"
                            />
                            <span className="text-white">{playlist.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlaylistPopup;