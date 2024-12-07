import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets';
import ColorThief from 'colorthief';
import axios from 'axios';
import AlbumItem from '../components/AlbumItem'; // Add this import

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playWithUri } = useContext(PlayerContext);
  const [dominantColor, setDominantColor] = useState("#333333");
  const [secondaryColor, setSecondaryColor] = useState("#121212");
  const [playlistData, setPlaylistData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ tracks: [], artists: [], albums: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await axios.get(`http://localhost:3000/user/playlist/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { playlist } = response.data;
        setPlaylistData(playlist);

        // Get user data from playlist.userID
        if (playlist.userID) {
          setUserData({
            name: playlist.userID.name,
            email: playlist.userID.email
          });
        }

        // Get dominant color from playlist thumbnail
        if (playlist.thumbnail) {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = playlist.thumbnail || assets.plus_icon;
          img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            setDominantColor(`rgb(${dominantColor.join(",")})`);
            setSecondaryColor(`rgba(${dominantColor.join(",")}, 0.5)`);
          };
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setIsLoading(false);
      }
    };

    fetchPlaylistData();
  }, [id]);

  // Debounced search function
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.length > 0) {
        setIsSearching(true);
        try {
          const response = await axios.get(`http://localhost:3000/search`, {
            params: {
              q: searchQuery,
              type: "track,artist,album",
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });

          setSearchResults({
            tracks: response.data.tracks?.items || [],
            artists: response.data.artists?.items || [],
            albums: response.data.albums?.items || []
          });
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults({ tracks: [], artists: [], albums: [] });
        }
        setIsSearching(false);
      } else {
        setSearchResults({ tracks: [], artists: [], albums: [] });
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleArtistClick = async (artist) => {
    try {
      setIsSearching(true);
      setSelectedArtist(artist);

      // Fetch artist's tracks and albums
      const [tracksResponse, albumsResponse] = await Promise.all([
        axios.get(`http://localhost:3000/artist/${artist.id}/top-tracks`),
        axios.get(`http://localhost:3000/artist/${artist.id}/albums`)
      ]);

      setArtistTracks(tracksResponse.data.tracks || []);
      setArtistAlbums(albumsResponse.data.items || []);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching artist content:", error);
      setIsSearching(false);
    }
  };

  // Update the handleAlbumClick function
  const handleAlbumClick = async (album) => {
    try {
      setIsSearching(true);
      setSelectedAlbum(album);
      setSelectedArtist(null); // Clear artist selection
      setArtistTracks([]); // Clear artist tracks
      setArtistAlbums([]); // Clear artist albums

      // Fetch album tracks
      const tracksResponse = await axios.get(
        `http://localhost:3000/album/${album.id}/tracks`
      );

      setAlbumTracks(tracksResponse.data || []);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching album content:", error);
      setIsSearching(false);
    }
  };

  // Update the handleBackClick function
  const handleBackClick = () => {
    if (selectedAlbum) {
      // If in album view, go back to artist view
      setSelectedAlbum(null);
      setAlbumTracks([]);
      // Restore artist view if coming from artist
      if (selectedArtist) {
        const fetchArtistContent = async () => {
          try {
            setIsSearching(true);
            const [tracksResponse, albumsResponse] = await Promise.all([
              axios.get(`http://localhost:3000/artist/${selectedArtist.id}/top-tracks`),
              axios.get(`http://localhost:3000/artist/${selectedArtist.id}/albums`)
            ]);
            setArtistTracks(tracksResponse.data.tracks || []);
            setArtistAlbums(albumsResponse.data.items || []);
            setIsSearching(false);
          } catch (error) {
            console.error("Error fetching artist content:", error);
            setIsSearching(false);
          }
        };
        fetchArtistContent();
      }
    } else {
      // If in artist view, go back to search results
      setSelectedArtist(null);
      setArtistTracks([]);
      setArtistAlbums([]);
    }
  };

  // Search Results Section
  const SearchResults = () => (
    <div className="mt-6">
      {isSearching ? (
        <p className="text-[#727272]">Đang tìm kiếm...</p>
      ) : (
        <>
          {selectedArtist || selectedAlbum ? (
            <>
              {/* Back Button Section */}
              <div className="mb-6 flex items-center gap-4">
                <button 
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-white hover:text-[#1ed760]"
                >
                  <img 
                    src={assets.arrow_left} 
                    alt="Back" 
                    className="h-5 w-5"
                  />
                  <span className="text-lg font-bold">
                    {selectedAlbum ? selectedAlbum.name : selectedArtist?.name}
                  </span>
                </button>
              </div>

              {/* Album Tracks */}
              {selectedAlbum && (
                <div className="mb-8">
                  <div className="grid gap-2">
                    {albumTracks.map((track) => (
                      <div
                        key={track.id}
                        className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                      >
                        <img
                          src={selectedAlbum.images[2].url}
                          alt={track.name}
                          className="h-10 w-10 rounded"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="text-white">{track.name}</p>
                          <p className="text-sm text-[#a7a7a7]">
                            {track.artists?.map(artist => artist.name).join(', ')}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlaylist(track.id);
                          }}
                          className="px-4 py-1 text-sm bg-transparent border border-white rounded-full opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artist Content - Only show if no album is selected */}
              {selectedArtist && !selectedAlbum && (
                <>
                  {/* Artist's Tracks */}
                  {artistTracks.length > 0 && (
                    <div className="mb-8">
                      <h3 className="mb-4 text-lg font-bold">Những bài hát phổ biến</h3>
                      <div className="grid gap-2">
                        {artistTracks.map((track) => (
                          <div
                            key={track.id}
                            className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                          >
                            <img
                              src={track.album.images[2].url}
                              alt={track.name}
                              className="h-10 w-10 rounded"
                            />
                            <div className="flex flex-1 flex-col">
                              <p className="text-white">{track.name}</p>
                              <p className="text-sm text-[#a7a7a7]">{track.album.name}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToPlaylist(track.id);
                              }}
                              className="px-4 py-1 text-sm bg-transparent border border-white rounded-full opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
                            >
                              Thêm
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Artist's Albums - Updated to match track item style */}
                  {artistAlbums.length > 0 && (
                    <div className="mb-8">
                      <h3 className="mb-4 text-lg font-bold">Albums</h3>
                      <div className="grid gap-2">
                        {artistAlbums.map((album) => (
                          <div
                            key={album.id}
                            onClick={() => handleAlbumClick(album)}
                            className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                          >
                            <img
                              src={album.images[2].url}
                              alt={album.name}
                              className="h-10 w-10 rounded"
                            />
                            <div className="flex flex-1 flex-col">
                              <p className="text-white">{album.name}</p>
                              <p className="text-sm text-[#a7a7a7]">
                                {album.artists[0]?.name} • {album.release_date?.slice(0, 4)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToPlaylist(album.id);
                              }}
                              className="px-4 py-1 text-sm bg-transparent border border-white rounded-full opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
                            >
                              Thêm
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            // Initial Search Results
            <>
              {/* Single Artist Result */}
              {searchResults.artists.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-bold">Nghệ sĩ</h3>
                  <div 
                    onClick={() => handleArtistClick(searchResults.artists[0])}
                    className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                  >
                    <img
                      src={searchResults.artists[0].images[0]?.url || assets.avatar}
                      alt={searchResults.artists[0].name}
                      className="h-10 w-10 rounded"
                    />
                    <div className="flex flex-1 flex-col">
                      <p className="text-white">{searchResults.artists[0].name}</p>
                      <p className="text-sm text-[#a7a7a7]">Nghệ sĩ</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tracks Results */}
              {searchResults.tracks.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-4 text-lg font-bold">Bài hát</h3>
                  <div className="grid gap-2">
                    {searchResults.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                      >
                        <img
                          src={track.album.images[2].url}
                          alt={track.name}
                          className="h-10 w-10 rounded"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="text-white">{track.name}</p>
                          <p className="text-sm text-[#a7a7a7]">{track.artists[0].name}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlaylist(track.id);
                          }}
                          className="px-4 py-1 text-sm bg-transparent border border-white rounded-full opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Albums Results */}
              {searchResults.albums.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-4 text-lg font-bold">Albums</h3>
                  <div className="grid gap-2">
                    {searchResults.albums.map((album) => (
                      <div
                        key={album.id}
                        onClick={() => handleAlbumClick(album)}
                        className="group flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-[#ffffff1a]"
                      >
                        <img
                          src={album.images[2].url}
                          alt={album.name}
                          className="h-10 w-10 rounded"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="text-white">{album.name}</p>
                          <p className="text-sm text-[#a7a7a7]">
                            {album.artists[0]?.name} • {album.release_date?.slice(0, 4)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlaylist(album.id);
                          }}
                          className="px-4 py-1 text-sm bg-transparent border border-white rounded-full opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="relative w-full bg-[#121212] text-white">
      {/* Header section */}
      <div 
        className="flex h-[340px] items-end p-8"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 0%, ${secondaryColor} 100%)`,
          filter: "brightness(0.8)"
        }}
      >
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
          <img 
            src={playlistData?.thumbnail || assets.plus_icon}
            alt="Playlist Cover" 
            className="h-40 w-40 rounded-md shadow-2xl md:h-60 md:w-60" 
          />
          <div className="flex flex-col justify-end">
            <p className="text-xs font-normal md:text-sm">Playlist</p>
            <h1 className="mb-2 text-4xl font-black md:mb-6 md:text-8xl text-white">
              {playlistData?.name || "My Playlist"}
            </h1>
            <div className="flex items-center gap-2">
              <span className="font-medium"></span>
              <span className="">0 songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div 
        className="relative px-8 py-6"
        style={{
          background: `linear-gradient(to bottom, ${secondaryColor} 0%, #121212 100%)`
        }}
      >
        <div className="flex items-center gap-8">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] hover:scale-105 hover:bg-[#1fdf64]">
            <img className="h-8 w-8" src={assets.play_icon} alt="Play" />
          </button>
          <button className="flex h-8 items-center justify-center rounded-full border-[1px] border-white px-4 opacity-70 hover:opacity-100">
            Follow
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-8 py-6">
        <h2 className="mb-6 text-2xl font-bold">Hãy cùng tìm nội dung cho danh sách của bạn</h2>
        <div className="relative w-full max-w-[364px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài hát hoặc nghệ sĩ yêu thích"
            className="w-full rounded-full bg-[#242424] px-12 py-3 text-sm text-white placeholder-[#727272] outline-none focus:outline-2 focus:outline-white"
          />
          <img
            src={assets.search_icon}
            alt="Search"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-60"
          />
        </div>

        {/* Search Results */}
        {searchQuery && <SearchResults />}
      </div>
    </div>
  );
};

export default PlaylistPage;