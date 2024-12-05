import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import ColorThief from "colorthief";
import AlbumItem from "../components/AlbumItem"; // Import AlbumItem component

const AlbumPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [album, setAlbum] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [relatedAlbums, setRelatedAlbums] = useState([]); // State for related albums
  const [error, setError] = useState(null);
  const [dominantColor, setDominantColor] = useState("#333333");
  const [secondaryColor, setSecondaryColor] = useState("#333333");

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/album/${id}`);
        console.log("Album data:", response.data); // Debugging log
        setAlbum(response.data);

        const artistResponse = await axios.get(
          `http://localhost:3000/artist/${response.data.artists[0].id}`
        );
        console.log("Artist data:", artistResponse.data); // Debugging log
        setArtist(artistResponse.data);

        const tracksResponse = await axios.get(
          `http://localhost:3000/album/${id}/tracks`
        );
        console.log("Album tracks:", tracksResponse.data); // Debugging log
        setAlbumTracks(tracksResponse.data); // Ensure it's an array

        // Fetch related albums from the same artist
        const relatedAlbumsResponse = await axios.get(
          `http://localhost:3000/artist/${response.data.artists[0].id}/albums`
        );
        console.log("Related albums:", relatedAlbumsResponse.data); // Debugging log
        setRelatedAlbums(
          relatedAlbumsResponse.data.items.filter(
            (album) => album.id !== id
          )
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
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchAlbumData();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const playWithUri = (trackId) => {
    // Implement playWithUri function
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const calculateTotalDuration = (tracks) => {
    const totalDuration = tracks.reduce(
      (acc, track) => acc + track.duration,
      0
    );
    const minutes = Math.floor(totalDuration / 60000);
    const seconds = Math.floor((totalDuration % 60000) / 1000);
    return `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;
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

      <div
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
            />
          </div>

          <button className="flex h-4 cursor-pointer items-center justify-center rounded-3xl border-2 border-solid p-4 opacity-70 transition-all hover:opacity-100">
            Follow
          </button>
        </div>

        <div className="mb-4 mt-10 grid grid-cols-[1fr_auto_auto] pl-2 text-[#a7a7a7]">
          <div className="flex items-center">
            <span className="mr-4 w-8 text-right">#</span>
            <span className="pr-10">Tiêu đề</span>
          </div>
          <img
            className="my-auto ml-auto mr-16 w-4"
            src={assets.clock_icon}
            alt="Clock Icon"
          />
        </div>

        <hr className="border-top-1 bg-[#30363b] opacity-15" />
        <br></br>

        {Array.isArray(albumTracks) &&
          albumTracks.map((track, index) => (
            <div
              onClick={() => playWithUri(track.id)}
              key={index}
              className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2 rounded-s p-2 text-[#a7a7a7] hover:bg-[#ffffff2b]"
            >
              <div className="flex items-center">
                <p className="mr-4 w-8 text-right">{index + 1}</p>
                <div className="flex flex-col">
                  <p className="truncate font-normal text-white">
                    {track.name}
                  </p>
                  <p className="truncate text-[14px]">
                    {track.singers.join(", ")}
                  </p>
                </div>
              </div>
              <p className="mr-10 text-right">
                {formatDuration(track.duration)}
              </p>
            </div>
          ))}
      </div>

      {/* More from Artist Section */}
      {relatedAlbums.length > 0 && (
        <section className="relative z-10 mb-8 px-6">
          <h2 className="mb-4 text-xl font-bold">
            More by {album?.artists[0]?.name}
          </h2>
          <div className="flex flex-row overflow-hidden overflow-x-scroll">
            {relatedAlbums.map((album) => (
              <AlbumItem
                key={album.id}
                id={album.id}
                name={album.name}
                image={album.images[0]?.url}
                time={album.release_date}
                singer={album.artists[0]?.name}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default AlbumPage;