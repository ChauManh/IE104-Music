import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import ColorThief from "colorthief";
import AlbumItem from "../components/AlbumItem";
import { PlayerContext } from "../context/PlayerContext";
import { useQueue } from "../context/QueueContext";
import { fetchAlbum, fetchAlbumTracks } from "../services/albumApi";
import { 
  addLikedAlbum, 
  getPlaylists, 
  deletePlaylist,  // Make sure this is properly exported from userApi
  removeLikedAlbum,
  addSongToPlaylist,
  removeSongFromPlaylist
} from "../services/userApi";
import { getArtist, getArtistAlbums } from "../services/artistApi"; // Remove deletePlaylist from here
import { formatDuration } from "../utils/formatDuration";
import { calculateTotalDuration } from "../utils/calculateTotalDuration";
import PlaylistPopup from "../components/PlaylistPopup";
import { getDetailSong, getDetailSongBySpotifyId } from "../services/songApi";
import axios from "axios";

const AlbumPage = () => {
  const { setQueue } = useQueue();
  const { playWithUri, setTrack, addTrackToQueue } = useContext(PlayerContext);
  const { id } = useParams();
  const location = useLocation();
  const [artist, setArtist] = useState(null);
  const [album, setAlbum] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [relatedAlbums, setRelatedAlbums] = useState([]); // State for related albums
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [dominantColor, setDominantColor] = useState("#333333");
  const [secondaryColor, setSecondaryColor] = useState("#333333");
  const [isFollowed, setIsFollowed] = useState(false);
  const [likedTracks, setLikedTracks] = useState({});
  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);

  const Notification = ({ message }) => (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="rounded-full bg-[#1ed760] px-4 py-2 text-center text-sm font-medium text-black shadow-lg">
        <span>{message}</span>
      </div>
    </div>
  );

  const handlePlayAll = async () => {
    if (!albumTracks || albumTracks.length === 0) {
      setNotificationMessage(`Không có bài hát nào có sẵn trong playlist`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      window.dispatchEvent(new Event("playlistsUpdated"));
      return;
    }
    handleTrackClick(albumTracks[0], 0);
  };

  const handleTrackClick = (track, index) => {
    setTrack({
      id: track.id,
      name: track.name,
      album: album.name,
      image: album.images[0]?.url,
      singer: track.singers.join(", "),
      duration: track.duration,
      uri: track.uri, // Nếu có URI bài hát
    });
    if (index === albumTracks.length - 1) {
      setQueue([]);
    } else {
      const newQueue = albumTracks.slice(index + 1).map((item) => ({
        id: item.id,
        name: item.name,
        album: album.name,
        image: album.images[0]?.url,
        singer: item.singers.join(", "),
        duration: item.duration,
        uri: item.uri,
      }));
      setQueue(newQueue);
      // addTrackToQueue(newQueue[0].uri);
    }
    playWithUri(track.uri);
  };

  const followAlbum = async (album) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }
      await axios.post(
        "http://localhost:3000/user/create_playlist",
        {
          name: album.name,
          thumbnail: album.images[0]?.url,
          type: "album",
          albumId: album.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("API follow album error:", error);
      throw error;
    }
  };
  
  const unfollowAlbum = async (albumId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }
      await axios.delete("http://localhost:3000/user/albums/unfollow", {
        headers: { Authorization: `Bearer ${token}` },
        data: { albumId },
      });
    } catch (error) {
      console.error("API unfollow album error:", error);
      throw error;
    }
  };

  const handleFollowAlbum = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const playlistsResponse = await getPlaylists();
      const existingPlaylist = playlistsResponse.data.playlists.find(
        playlist => playlist.type === "album" && playlist.albumId === id
      );

      if (existingPlaylist) {
        // Unfollow album - make sure both operations complete
        try {
          await Promise.all([
            deletePlaylist(existingPlaylist._id),
            removeLikedAlbum(id)
          ]);

          setIsFollowed(false);
          setNotificationMessage(`Đã xóa ${album.name} khỏi thư viện`);
        } catch (error) {
          console.error("Error unfollowing album:", error);
          throw error;
        }
      } else {
        // Follow album
        await addLikedAlbum(album);
        setIsFollowed(true);
        setNotificationMessage(`Đã thêm ${album.name} vào thư viện`);
      }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      window.dispatchEvent(new Event("playlistsUpdated"));

    } catch (error) {
      console.error("Error following/unfollowing album:", error);
      setIsFollowed(prev => !prev);
      setNotificationMessage("Không thể thực hiện thao tác");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  useEffect(() => {
    const checkIfFollowed = async () => {
      try {
        const playlistsResponse = await getPlaylists();

        const exists = playlistsResponse.data.playlists.some(
          (playlist) => playlist.type === "album" && playlist.albumId === id,
        );

        setIsFollowed(exists);
      } catch (error) {
        console.error("Error checking album follow status:", error);
      }
    };

    checkIfFollowed();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAlbumData = async () => {
      try {
        const response = await fetchAlbum(id);
        setAlbum(response.data);

        const artistResponse = await getArtist(response.data.artists[0].id);
        setArtist(artistResponse.data);

        const tracksResponse = await fetchAlbumTracks(id);
        setAlbumTracks(tracksResponse.data);

        // Fetch related albums from the same artist
        const relatedAlbumsResponse = await getArtistAlbums(
          response.data.artists[0].id,
        );
        setRelatedAlbums(
          relatedAlbumsResponse.data.items.filter((album) => album.id !== id),
        );

        // Get dominant color from album image
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = response.data.images[0]?.url;
        img.onload = () => {
          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(img);
          setDominantColor(`rgb(${dominantColor.join(",")})`);
          setSecondaryColor(`rgba(${dominantColor.join(",")}, 0.5)`); // Adjust the alpha for a lighter color
        };
      } catch (error) {
        setError("Error fetching album data");
        console.error(
          "Error fetching album:",
          error.response ? error.response.data : error.message,
        );
      }
    };

    fetchAlbumData();
  }, [id, location.pathname]);

  useEffect(() => {
    const checkLikedTracks = async () => {
      try {
        const response = await getPlaylists();
        const likedPlaylist = response.data.playlists.find(
          playlist => playlist.name === "Bài hát đã thích"
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
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please login first");
        return;
      }

      // Toggle like status in UI immediately
      setLikedTracks(prev => ({
        ...prev,
        [trackId]: !prev[trackId]
      }));

      // Get liked songs playlist
      const playlistsResponse = await getPlaylists();
      let likedPlaylist = playlistsResponse.data.playlists.find(
        playlist => playlist.name === "Bài hát đã thích"
      );

      if (!likedTracks[trackId]) {
        // Create liked playlist if it doesn't exist
        if (!likedPlaylist) {
          const createResponse = await axios.post(
            "http://localhost:3000/user/create_playlist",
            { name: "Bài hát đã thích" },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          likedPlaylist = createResponse.data.playlist;
        }

        // Add song to playlist
        await addSongToPlaylist(likedPlaylist._id, trackId);
        setNotificationMessage("Đã thêm vào Bài hát đã thích");
      } else {
        if (!likedPlaylist) {
          throw new Error("Liked songs playlist not found");
        }

        // Get song details by Spotify ID
        const songDetails = await getDetailSongBySpotifyId(trackId);
        
        if (!songDetails.data || !songDetails.data._id) {
          throw new Error("Song not found in database");
        }

        // Remove song from playlist
        await removeSongFromPlaylist(
          likedPlaylist._id,
          songDetails.data._id
        );
        setNotificationMessage("Đã xóa khỏi Bài hát đã thích");
      }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      window.dispatchEvent(new Event("playlistsUpdated"));

    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert UI state if operation failed
      setLikedTracks(prev => ({
        ...prev,
        [trackId]: !prev[trackId]
      }));
      setNotificationMessage("Không thể thực hiện thao tác");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  if (error) return <div>{error}</div>;
  if (!album) return <div> </div>;

  return (
    <>
      <div
        className="relative w-full px-6 py-4"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 30%, ${secondaryColor} 100%)`,
          filter: "brightness(1.1)",
        }}
      >
        <div className="flex items-end pb-4 pt-2">
          <img
            src={album.images[0]?.url}
            alt={album.name}
            className="mr-6 h-56 w-56 rounded-xl object-cover"
          />
          <div className="z-10">
            <p className="text-sm font-normal">Album</p>
            <h1 className="mb-4 text-6xl font-black">{album.name}</h1>
            <p className="mt-1">
              {artist && (
                <img
                  className="inline-block h-6 w-6 rounded-full"
                  src={artist.images[1]?.url}
                  alt={artist.name}
                />
              )}
              <b> {album.artists.map((artist) => artist.name).join(", ")}</b>{" "}
              <span className="font-thin text-[#cccaca] opacity-90">
                {" "}
                • {new Date(album.release_date).getFullYear()} •{" "}
                {albumTracks.length} bài hát,{" "}
                {calculateTotalDuration(albumTracks)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <section
        className="relative z-10 px-6 py-4"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} -25%, #121212 25%)`,
        }}
      >
        <div className="relative z-0 flex items-center pb-6 pt-2">
          <div className="pr-8">
            <img
              className="h-14 w-14 cursor-pointer rounded-[30px] border-[18px] border-[#3be477] bg-[#3be477] opacity-70 transition-all hover:opacity-100"
              src={assets.play_icon}
              alt=""
              onClick={() => handlePlayAll()}
            />
          </div>
          <button
            onClick={handleFollowAlbum}
            className={`flex h-4 cursor-pointer items-center justify-center rounded-3xl border-2 border-solid p-4 opacity-70 transition-all hover:opacity-100 ${
              isFollowed ? "border-[#1ed760] bg-[#1ed760] text-black" : ""
            }`}
          >
            {isFollowed ? "Đã theo dõi" : "Theo dõi"}
          </button>
        </div>


        {/* Tracklist Section */}
        <div className="mb-4 mt-10 grid grid-cols-[1fr_auto_0.1fr] pl-2 text-[#a7a7a7]">
          <div className="flex items-center">
            <span className="mr-6 w-8 text-right">#</span>
            <span className="">Tiêu đề</span>
          </div>
          <img
            className="my-auto mx-auto w-4"
            src={assets.clock_icon}
            alt="Clock Icon"
          />
        </div>

        <hr className="border-top-1 bg-[#30363b] opacity-15" />
        <br></br>

        {/* Tracklist */}
        <div className="grid grid-rows-[auto_auto_1fr_auto_auto] gap-4">
        {Array.isArray(albumTracks) &&
          albumTracks.map((track, index) => (
            <div
              onClick={() => handleTrackClick(track, index)}
              key={index}
              className="group grid cursor-pointer grid-cols-[0.1fr_2fr_0.1fr_0.1fr_0.15fr] items-center gap-2 rounded rounded-s p-2 text-[#a7a7a7] hover:bg-[#ffffff2b]"
            >
                <p className="mr-4 w-8 text-right">{index + 1}</p>
                {/* index */}
                <div className="flex flex-col">
                  <p className="truncate max-w-[350px] font-normal text-white">
                    {track.name}
                  </p>
                  <p className="truncate text-[14px]">
                    {track.singers.join(", ")}
                  </p>
                </div>
                {/* track name */}

                <div className="opacity-0 transition-all hover:scale-105 group-hover:opacity-100">
                  <img
                    className="h-4 w-4 cursor-pointer opacity-70 transition-colors duration-200 hover:opacity-100"
                    src={likedTracks[track.id] ? assets.liked_icon : assets.like_icon}
                    alt="Like"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick(track.id);
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  {formatDuration(track.duration)}
                </p>
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

      {/* More from Artist Section */}
      {relatedAlbums.length > 0 && (
        <section className="relative z-10 mb-8 px-6">
          <h2 className="mb-4 text-xl font-bold">
            Album khác của {album?.artists[0]?.name}
          </h2>
          <div className="album-scrollbar grid auto-cols-[200px] grid-flow-col gap-4 overflow-x-auto">
            {relatedAlbums.map((album) => (
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
      )}
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
    </>
  );
};

export default AlbumPage;
