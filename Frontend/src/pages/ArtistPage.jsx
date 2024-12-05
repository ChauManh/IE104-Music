import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import SongItem from "../components/SongItem";
import AlbumItem from "../components/AlbumItem";
import PopupAbout from "../components/PopupAbout";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useQueue } from "../context/QueueContext";
import ColorThief from "colorthief";

//npm install colorthief

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const { play, pause, plus } = useContext(PlayerContext);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
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

  if (error) return <div>{error}</div>;
  if (!artist) return <div></div>;

  return (
    <div className="relative w-full bg-[#121212] px-0 text-white">
      {/* Header Background */}
      <div
        className="flex h-[40vh] items-end p-6"
        style={{
          backgroundImage: `url(${artist.images[0]?.url})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: `50% 30%`,
        }}
      >
        {/* Header Info */}
        <div className="z-10">
          <p className="text-sm font-bold">Verified Artist</p>
          <h1 className="mb-6 text-8xl font-black">{artist.name}</h1>
          <p className="text-l font-medium">
            {artist.followers.total.toLocaleString()} monthly listeners
          </p>
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
            Follow
          </button>
        </div>

        {/* Content */}
        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-2xl font-bold">Popular</h2>

          <div className="flex flex-col">
            {Array.isArray(topTracks) &&
              topTracks.map((track, index) => (
                <SongItem
                  key={track.id}
                  id={track.id}
                  name={track.name}
                  image={track.album.images[2].url}
                  // singer={track.album.name}
                  index={index}
                />
              ))}
          </div>
        </section>

        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-xl font-bold">Albums</h2>
          <div className="flex flex-row overflow-hidden overflow-x-scroll">
            {Array.isArray(albums) &&
              albums.map((album, index) => (
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

        {/* Content About */}
        <section className="relative z-10 mb-8">
          <h2 className="mb-4 text-xl font-bold">About</h2>
          <div className="relative h-[60vh]" onClick={togglePopup}>
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
                {artist.followers.total.toLocaleString()} monthly listeners
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
