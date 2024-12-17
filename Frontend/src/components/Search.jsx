import React, { useState, useEffect, useContext } from "react";
import ArtistItem from "./ArtistItem";
import AlbumItem from "./AlbumItem";
import { assets } from "../assets/assets";
import PlaylistPopup from "./PlaylistPopup";
import { PlayerContext } from "../context/PlayerContext";
import {
  addSongToPlaylist,
  getPlaylists,
  removeSongFromPlaylist,
} from "../services/userApi";
import { getDetailSong, getDetailSongBySpotifyId } from "../services/songApi";

const Search = ({ results, query }) => {
  const topResult =
    results.tracks.items[0] ||
    results.artists.items[0] ||
    results.albums.items[0];

  return (
    <div className="px-4 pt-6 md:px-6">
      {query && (
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">
          Kết quả tìm kiếm cho "{query}"
        </h1>
      )}

      {/* Top Result and Songs Section */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <TopResultSection result={topResult} />
        <SongsSection tracks={results.tracks.items} />
      </div>

      {/* Artists Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">Nghệ sĩ</h2>
        <div className="album-scrollbar grid auto-cols-[200px] grid-flow-col gap-4 overflow-x-auto">
          {results.artists.items.map((artist) => (
            <ArtistItem
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image={artist.images[0]?.url}
            />
          ))}
        </div>
      </section>

      {/* Albums Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">
          Danh sách đĩa nhạc
        </h2>
        <div className="album-scrollbar grid auto-cols-[200px] grid-flow-col gap-4 overflow-x-auto">
          {results.albums.items.map((album) => (
            <AlbumItem
              key={album.id}
              id={album.id}
              name={album.name}
              image={album.images[0]?.url}
              singer={album.artists[0]?.name}
              time={album.release_date}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

// Top Result Section remains the same
const TopResultSection = ({ result }) => {
  const { setTrack, playWithUri } = useContext(PlayerContext);

  if (!result) return null;

  const handleTrackClick = (track) => {
    setTrack({
      id: track.id,
      name: track.name,
      image: track.album.images[0]?.url,
      singer: track.artists[0].name,
      duration: track.duration_ms,
      uri: track.uri,
    });
    playWithUri(track.uri);
  };

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">Kết quả hàng đầu</h2>
      <div
        onClick={() => handleTrackClick(result)}
        className="cursor-pointer rounded-lg bg-[#181818] p-5 transition-colors hover:bg-[#282828]"
      >
        <img
          src={result.album?.images[0].url || result.images?.[0].url}
          alt={result.name}
          className="mb-4 h-24 w-24 rounded-md shadow-lg"
        />
        <p className="mb-2 text-2xl font-bold">{result.name}</p>
        <p className="text-sm text-gray-400">
          {result.type.charAt(0).toUpperCase()}
          {result.type.slice(1)} • {result.artists?.[0].name || "Artist"}
        </p>
      </div>
    </section>
  );
};

// Songs Section using SongItem
const SongsSection = ({ tracks }) => {
  const { playWithUri, setTrack } = useContext(PlayerContext);
  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [likedTracks, setLikedTracks] = useState({});

  // Check which tracks are in playlists when component mounts
  useEffect(() => {
    const checkLikedTracks = async () => {
      try {
        const response = await getPlaylists();

        // Find "Bài hát đã thích" playlist
        const likedPlaylist = response.data.playlists.find(
          (playlist) => playlist.name === "Bài hát đã thích",
        );

        if (likedPlaylist && likedPlaylist.songs) {
          const trackMap = {};
          for (const songId of likedPlaylist.songs) {
            const songDetails = await getDetailSong(songId);
            trackMap[songDetails.data.spotifyId] = true;
          }
          setLikedTracks(trackMap);
        }
      } catch (error) {
        console.error("Error checking liked tracks:", error);
      }
    };

    checkLikedTracks();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      const response = await getPlaylists();
      setUserPlaylists(response.data.playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setShowNotification(true);
      setNotificationMessage("Không thể tải danh sách playlist");
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const handleTrackClick = (track) => {
    setTrack({
      id: track.id,
      name: track.name,
      image: track.album.images[0]?.url,
      singer: track.artists[0].name,
      duration: track.duration_ms,
      uri: track.uri,
    });
    playWithUri(track.uri);
  };

  const handleLikeClick = async (trackId) => {
    try {
      // Toggle like status in UI immediately
      setLikedTracks((prev) => ({
        ...prev,
        [trackId]: !prev[trackId],
      }));

      // Get liked songs playlist
      const playlistsResponse = await getPlaylists();

      let likedPlaylist = playlistsResponse.data.playlists.find(
        (playlist) => playlist.name === "Bài hát đã thích",
      );

      if (!likedTracks[trackId]) {
        // Add to liked songs
        await addSongToPlaylist(likedPlaylist._id, trackId);

        setNotificationMessage("Đã thêm vào Bài hát đã thích");
      } else {
        // Get the song details first
        const songDetails = await getDetailSongBySpotifyId(trackId);
        if (!songDetails.data || !songDetails.data._id) {
          throw new Error("Could not find song in database");
        }

        // Remove song from playlist
        await removeSongFromPlaylist(likedPlaylist._id, songDetails.data._id);
        setNotificationMessage("Đã xóa khỏi Bài hát đã thích");
      }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      window.dispatchEvent(new Event("playlistsUpdated"));
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert UI state if operation failed
      setLikedTracks((prev) => ({
        ...prev,
        [trackId]: !prev[trackId],
      }));
    }
  };

  return (
    <section className="pl-4">
      <h2 className="mb-4 text-xl font-bold">Bài hát</h2>
      <div className="flex flex-col gap-2">
        {tracks.slice(0, 4).map((track) => (
          <div
            onClick={() => handleTrackClick(track)}
            key={track.id}
            className="group flex cursor-pointer items-center justify-between gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
          >
            <div className="flex items-center gap-4">
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="h-10 w-10 rounded"
              />
              <div className="flex flex-col">
                <p className="max-w-[200px] truncate text-white">
                  {track.name}
                </p>
                <p className="text-sm text-[#a7a7a7]">
                  {track.artists[0].name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-0 transition-all hover:scale-105 group-hover:opacity-100">
              <img
                className={`h-4 w-4 cursor-pointer opacity-70 transition-colors duration-200 hover:opacity-100`}
                src={
                  likedTracks[track.id] ? assets.liked_icon : assets.like_icon
                }
                alt="Like"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeClick(track.id);
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTrackId(track.id);
                  setShowPlaylistPopup(true);
                  fetchUserPlaylists();
                }}
                className="rounded-full bg-transparent px-4 py-1 text-sm text-white opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
              >
                <img
                  className="h-4 w-4 cursor-pointer rounded-[30px] opacity-70 transition-all hover:opacity-100"
                  src={assets.more_icon}
                  alt="Các sự lựa chọn khác"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <PlaylistPopup
        isOpen={showPlaylistPopup}
        onClose={() => setShowPlaylistPopup(false)}
        trackId={selectedTrackId}
        playlists={userPlaylists}
        setShowNotification={setShowNotification}
        setNotificationMessage={setNotificationMessage}
      />

      {showNotification && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="rounded-full bg-[#1ed760] px-4 py-2 text-center text-sm font-medium text-black shadow-lg">
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}
    </section>
  );
};

const ArtistsSection = ({ artists, onArtistClick }) => {
  if (!artists?.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Artists</h2>
      <div className="grid grid-cols-5 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onArtistClick(artist.id)}
            className="cursor-pointer rounded-lg bg-[#181818] p-4 transition-colors hover:bg-[#282828]"
          >
            <img
              src={artist.images[0]?.url}
              alt={artist.name}
              className="mb-4 aspect-square w-full rounded-full object-cover"
            />
            <p className="truncate text-center font-semibold">{artist.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const AlbumsSection = ({ albums, onAlbumClick }) => {
  if (!albums?.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Albums</h2>
      <div className="grid grid-cols-5 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => onAlbumClick(album.id)}
            className="cursor-pointer rounded-lg bg-[#181818] p-4 transition-colors hover:bg-[#282828]"
          >
            <img
              src={album.images[0].url}
              alt={album.name}
              className="mb-4 aspect-square w-full rounded-md object-cover"
            />
            <p className="truncate font-semibold">{album.name}</p>
            <p className="truncate text-sm text-gray-400">
              {album.artists[0].name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Search;
