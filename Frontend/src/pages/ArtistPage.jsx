import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AlbumItem from "../components/AlbumItem";
import PopupAbout from "../components/PopupAbout";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { formatDuration } from "../utils/formatDuration";
import { useQueue } from "../context/QueueContext";
import ColorThief from "colorthief";
import { refreshPlaylists } from "../Layout/Components/Sidebar";
import PlaylistPopup from "../components/PlaylistPopup";
import {
  addSongToPlaylist,
  deletePlaylist,
  followArtist,
  getPlaylists,
  removeSongFromPlaylist,
  unfollowArtist,
} from "../services/userApi";
import {
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
} from "../services/artistApi";
import { getDetailSong, getDetailSongBySpotifyId } from "../services/songApi";

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const { playWithUri, setTrack, addTrackToQueue } = useContext(PlayerContext);
  const { setQueue } = useQueue();
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [likedTracks, setLikedTracks] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [dominantColor, setDominantColor] = useState("#333333");
  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  const handlePlayAll = async () => {
    if (!topTracks || topTracks.length === 0) {
      setNotificationMessage(`Không có bài hát nào có sẵn trong playlist`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      window.dispatchEvent(new Event("playlistsUpdated"));
      return;
    }
    handleTrackClick(topTracks[0], 0);
  };

  const handleTrackClick = (track, index) => {
    setTrack({
      id: track.id,
      name: track.name,
      album: track.album.name,
      image: track.album.images[0]?.url,
      singer: track.artists[0].name,
      duration: track.duration_ms,
      uri: track.uri,
    });
    if (index === topTracks.length - 1) {
      setQueue([]);
    } else {
      const newQueue = topTracks.slice(index + 1).map((item) => ({
        id: item.id,
        name: item.name,
        album: item.album.name,
        image: item.album.images[0]?.url,
        singer: item.artists[0].name,
        duration: item.duration_ms,
        uri: item.uri,
      }));
      setQueue(newQueue);
      // addTrackToQueue(newQueue[0].uri);
    }
    playWithUri(track.uri);
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await getPlaylists();
      setUserPlaylists(
        response.data.playlists.filter((p) => p.type === "playlist"),
      );
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const Notification = ({ message }) => (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="rounded-full bg-[#1ed760] px-4 py-2 text-center text-sm font-medium text-black shadow-lg">
        <span>{message}</span>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await getArtist(id);
        setArtist(response.data);

        const tracksResponse = await getArtistTopTracks(id);
        setTopTracks(tracksResponse.data.tracks || []);

        const albumsResponse = await getArtistAlbums(id);
        setAlbums(albumsResponse.data.items || []); // Ensure it's an array

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = response.data.images[0]?.url;
        img.onload = () => {
          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(img);
          setDominantColor(`rgb(${dominantColor.join(",")})`);
        };
      } catch (error) {
        setError("Error fetching artist data");
        console.error(
          "Error fetching artist:",
          error.response ? error.response.data : error.message,
        );
      }
    };

    fetchArtistData();
  }, [id]);

  useEffect(() => {
    const checkIfFollowed = async () => {
      try {
        const playlistsResponse = await getPlaylists();

        const exists = playlistsResponse.data.playlists.some(
          (playlist) => playlist.type === "artist" && playlist.artistId === id,
        );

        setIsFollowed(exists);
      } catch (error) {
        console.error("Error checking artist follow status:", error);
      }
    };

    checkIfFollowed();
  }, [id]);

  // Add this useEffect to check liked songs when component mounts
  useEffect(() => {
    const checkLikedTracks = async () => {
      try {
        const response = await getPlaylists();

        const likedPlaylist = response.data.playlists.find(
          (playlist) => playlist.name === "Bài hát đã thích",
        );
        if (likedPlaylist && likedPlaylist.songs) {
          const trackMap = {};
          for (const songId of likedPlaylist.songs) {
            const songDetails = await getDetailSong(songId);
            if (songDetails.data.spotifyId) {
              trackMap[songDetails.data.spotifyId] = true;
            }
          }
          setLikedTracks(trackMap);
        }
      } catch (error) {
        console.error("Error checking liked tracks:", error);
      }
    };

    checkLikedTracks();
  }, []);

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
        // Add song to playlist
        await addSongToPlaylist(likedPlaylist._id, trackId);

        setNotificationMessage("Đã thêm vào Bài hát đã thích");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        window.dispatchEvent(new Event("playlistsUpdated"));
      } else {
        // Unlike logic - Find and remove song
        if (!likedPlaylist) {
          throw new Error("Liked songs playlist not found");
        }

        // Get song details by Spotify ID
        const songDetailsResponse = await getDetailSongBySpotifyId(trackId);

        if (!songDetailsResponse.data?._id) {
          throw new Error("Song not found in database");
        }
        // Remove song from playlist using proper endpoint
        await removeSongFromPlaylist(
          likedPlaylist._id,
          songDetailsResponse.data._id,
        );

        setNotificationMessage("Đã xóa khỏi Bài hát đã thích");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        window.dispatchEvent(new Event("playlistsUpdated"));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert UI state if operation failed
      setLikedTracks((prev) => ({
        ...prev,
        [trackId]: !prev[trackId],
      }));
      setShowNotification(true);
      setNotificationMessage("Không thể xóa bài hát khỏi danh sách yêu thích");
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const handleFollowArtist = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return;
      }

      // Get existing playlists before toggling UI state
      const playlistsResponse = await getPlaylists();

      const existingPlaylist = playlistsResponse.data.playlists.find(
        (playlist) => playlist.type === "artist" && playlist.artistId === id,
      );

      if (existingPlaylist) {
        try {
          // Unfollow artist
          await Promise.all([
            // Delete the playlist
            deletePlaylist(existingPlaylist._id),
            // Unfollow the artist
            unfollowArtist(id),
          ]);

          // Update UI state after successful unfollow
          setIsFollowed(false);
          setNotificationMessage(`Đã bỏ theo dõi ${artist.name}`);
        } catch (error) {
          console.error("Error unfollowing:", error);
          throw error; // Propagate error to main catch block
        }
      } else {
        try {
          // Follow artist
          await followArtist(artist);

          // Update UI state after successful follow
          setIsFollowed(true);
          setNotificationMessage(`Đã theo dõi ${artist.name}`);
        } catch (error) {
          console.error("Error following:", error);
          throw error; // Propagate error to main catch block
        }
      }

      // Show notification and refresh sidebar
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);

      // Force refresh of playlists in sidebar
      await refreshPlaylists(setUserPlaylists); // If you have this function
      window.dispatchEvent(new Event("playlistsUpdated"));
    } catch (error) {
      console.error("Error following/unfollowing artist:", error);
      // Revert UI state
      setIsFollowed((prev) => !prev);
      // alert("Failed to follow/unfollow artist. Please try again.");
      window.dispatchEvent(new Event("playlistsUpdated"));
    }
  };

  if (error) return <div>{error}</div>;
  if (!artist) return <div></div>;

  return (
    <div className="relative w-full bg-[#121212] px-0 text-white">
      <div
        className="flex h-[40vh] items-end p-6"
        style={{
          backgroundImage: `url(${artist.images[0]?.url})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: `50% 20%`,
        }}
      >
        {/* Header Info */}
        <div className="z-10">
          <div className="flex items-center">
            <img
              className="mr-2 h-7 w-7 opacity-100"
              src={assets.verified_icon}
              alt=""
            />
            <p className="text-m font-Spotify">Nghệ sĩ được xác minh</p>
          </div>
          <h1 className="mb-4 mt-2 text-8xl font-black">{artist.name}</h1>
          <h6 className="text-l font-Spotify">
            {artist.followers.total.toLocaleString()} người nghe hằng tháng
          </h6>
        </div>
      </div>

      {/* Content button */}
      <div
        className="relative px-6 py-4"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 5%, #121212 15%)`,
        }}
      >
        <div className="relative flex items-center pb-6 pt-2">
          <div className="pr-8">
            <img
              className="h-14 w-14 cursor-pointer rounded-[30px] border-[18px] border-[#3be477] bg-[#3be477] opacity-70 transition-all hover:opacity-100"
              src={assets.play_icon}
              alt=""
              onClick={() => handlePlayAll()}
            />
          </div>

          <button
            onClick={handleFollowArtist}
            className={`flex h-4 cursor-pointer items-center justify-center rounded-3xl border-2 border-solid p-4 opacity-70 transition-all hover:opacity-100 ${
              isFollowed ? "border-[#1ed760] bg-[#1ed760] text-black" : ""
            }`}
          >
            {isFollowed ? "Đã theo dõi" : "Theo dõi"}
          </button>
        </div>

        {/* Popular Tracks Section */}
        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-2xl font-bold">Phổ biến</h2>
          <div className="grid grid-rows-[auto_auto_1fr_auto_auto] gap-4">
            {Array.isArray(topTracks) &&
              topTracks.map((track, index) => (
                <div
                  onClick={() => handleTrackClick(track, index)}
                  key={track.id}
                  className="group grid cursor-pointer grid-cols-[0.1fr_auto_2fr_0.1fr_auto_auto] items-center gap-4 rounded py-2 pr-4 transition-colors duration-200 hover:bg-[#ffffff26]"
                >
                  <p className="w-full text-right text-gray-400">{index + 1}</p>{" "}
                  {/* Index */}
                  <img
                    className="h-12 w-12 rounded"
                    src={track.album.images[0]?.url}
                    alt={track.name}
                  />{" "}
                  {/* Image */}
                  <div className="overflow-hidden">
                    <p className="truncate font-medium">{track.name}</p>{" "}
                    {/* Track Name */}
                    <p className="text-sm text-slate-200 opacity-60">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>{" "}
                    {/* Artists */}
                  </div>
                  <div className="opacity-0 transition-all hover:scale-105 group-hover:opacity-100">
                    <img
                      className="h-4 w-4 cursor-pointer opacity-70 transition-colors duration-200 hover:opacity-100"
                      src={
                        likedTracks[track.id]
                          ? assets.liked_icon
                          : assets.like_icon
                      }
                      alt="Like"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(track.id);
                      }}
                    />{" "}
                  </div>
                  {/* Like Icon */}
                  <p className="text-sm text-gray-400">
                    {formatDuration(track.duration_ms)}
                  </p>{" "}
                  {/* Duration */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrackId(track.id);
                      setShowPlaylistPopup(true);
                      fetchUserPlaylists();
                    }}
                    className="rounded-full bg-transparent py-1 pl-1 pr-4 text-sm text-white opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                  >
                    <img
                      className="h-4 w-4 cursor-pointer rounded-[30px] opacity-70 transition-all hover:opacity-100"
                      src={assets.more_icon}
                      alt=""
                    />
                  </button>
                </div>
              ))}
          </div>
        </section>

        {/* Albums Section */}
        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-xl font-bold">Danh sách đĩa nhạc</h2>
          <div className="album-scrollbar grid auto-cols-[200px] grid-flow-col gap-4 overflow-x-auto">
            {Array.isArray(albums) &&
              albums.map((album) => (
                <AlbumItem
                  key={album.id}
                  id={album.id}
                  name={album.name}
                  image={album.images[0].url}
                  time={album.release_date}
                  singer={album.artists[0]?.name}
                />
              ))}
          </div>
        </section>

        {/* About Section */}
        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-xl font-bold">Giới thiệu</h2>
          <div
            className="relative h-[60vh] cursor-pointer"
            onClick={togglePopup}
          >
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${artist.images[0]?.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(50%)",
              }}
            />
            <div className="relative z-10 mt-auto flex h-full flex-col justify-end p-6">
              <p className="text-l font-bold">
                {artist.followers.total.toLocaleString()} người nghe hằng tháng
              </p>
              <p className="mb-4 mt-1">{albums[0]?.name}</p>
              <p className="text-l">{artist.description}</p>
            </div>
          </div>
        </section>
      </div>

      {isPopupVisible && <PopupAbout onClose={togglePopup} />}
      {showNotification && (
        <>
          <Notification message={notificationMessage} />
        </>
      )}
      <PlaylistPopup
        isOpen={showPlaylistPopup}
        onClose={() => setShowPlaylistPopup(false)}
        trackId={selectedTrackId}
        playlists={userPlaylists}
        setShowNotification={setShowNotification}
        setNotificationMessage={setNotificationMessage}
      />
    </div>
  );
};

export default ArtistPage;
