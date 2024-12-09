import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SongItem from "../components/SongItem";
import AlbumItem from "../components/AlbumItem";
import PopupAbout from "../components/PopupAbout";
import { assets } from "../assets/assets";
import { createPlaylist, addSongToPlaylist } from "../util/api";
import { PlayerContext } from "../context/PlayerContext";
import ColorThief from "colorthief";

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const { playWithUri } = useContext(PlayerContext);
  const { play, pause, plus } = useContext(PlayerContext);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [likedTracks, setLikedTracks] = useState({});
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [dominantColor, setDominantColor] = useState("#333333");

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/artist/${id}`);
        console.log("Artist data:", response.data); // Debugging log
        setArtist(response.data);

        const tracksResponse = await axios.get(
          `http://localhost:3000/artist/${id}/top-tracks`,
        );
        console.log("Top tracks:", tracksResponse.data); // Debugging log
        setTopTracks(tracksResponse.data.tracks || []); // Ensure it's an array

        const albumsResponse = await axios.get(
          `http://localhost:3000/artist/${id}/albums`,
        );
        console.log("Albums:", albumsResponse.data); // Debugging log
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

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleLikeClick = async (trackId) => {
    setLikedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
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
              className="w-7 h-7 opacity-100 mr-2"
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
            />
          </div>

          <button className="flex h-4 cursor-pointer items-center justify-center rounded-3xl border-2 border-solid p-4 opacity-70 transition-all hover:opacity-100">
            Theo dõi
          </button>
        </div>

        {/* Popular Tracks Section */}
        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-2xl font-bold">Phổ biến</h2>
          <div className="grid grid-rows-[auto_auto_1fr_auto_auto] gap-4">
            {Array.isArray(topTracks) &&
              topTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="grid grid-cols-[0.1fr_auto_1fr_0.05fr_0.1fr] gap-4 items-center pr-4 py-2 hover:bg-[#ffffff26] transition-colors duration-200 rounded"
                >
                  <p className="text-gray-400 w-full text-right">{index + 1}</p> {/* Index */}
                  <img
                    className="w-12 h-12 rounded"
                    src={track.album.images[0]?.url}
                    alt={track.name}
                  /> {/* Image */}
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{track.name}</p> {/* Track Name */}
                    <p className="text-slate-200 text-sm opacity-60">{track.artists.map(artist => artist.name).join(', ')}</p> {/* Artists */}
                  </div>
                  <img
                    className={`w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-colors duration-200 ${likedTracks[track.id] ? 'text-green-500' : 'text-gray-400'}`}
                    src={assets.like_icon}
                    alt="Like"
                    onClick={() => handleLikeClick(track.id)}
                  /> {/* Like Icon */}
                  <p className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</p> {/* Duration */}
                </div>
              ))}
          </div>
        </section>

        {/* Albums Section */}
        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-xl font-bold">Danh sách đĩa nhạc</h2>
          <div className="grid grid-flow-col auto-cols-[200px] gap-4 overflow-x-auto album-scrollbar">
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
          <div className="relative h-[60vh] cursor-pointer" onClick={togglePopup}>
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
    </div>
  );
};

export default ArtistPage;
