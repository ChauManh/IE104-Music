import React from "react";
import SongItem from "./SongItem";
import ArtistItem from "./ArtistItem";
import AlbumItem from "./AlbumItem";

const Search = ({ results, query, onArtistClick, onAlbumClick }) => {
  const topResult =
    results.tracks.items[0] ||
    results.artists.items[0] ||
    results.albums.items[0];

  return (
    <div className="px-6 pt-6">
      {query && (
        <h1 className="mb-6 text-3xl font-bold">
          Kết quả tìm kiếm cho "{query}"
        </h1>
      )}

      {/* Top Result and Songs Section */}
      <div className="mb-8 grid grid-cols-2">
        <TopResultSection result={topResult} />
        <SongsSection tracks={results.tracks.items} />
      </div>

      {/* Artists Section */}
      <section className="mb-8">
        <h2 className="mb-1 text-2xl font-bold">Nghệ sĩ</h2>
        <div className="grid grid-cols-4 grid-rows-2 gap-4">
          {results.artists.items.slice(0, 8).map((artist) => (
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
        <h2 className="mb-1 text-2xl font-bold">Albums</h2>
        <div className="grid grid-cols-4 grid-rows-2 gap-4">
          {results.albums.items.slice(0, 8).map((album) => (
            <AlbumItem
              key={album.id}
              id={album.id}
              name={album.name}
              image={album.images[0].url}
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
  if (!result) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Kết quả hàng đầu</h2>
      <div className="rounded-lg bg-[#181818] p-5 transition-colors hover:bg-[#282828]">
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
  if (!tracks?.length) return null;

  return (
    <section className="pl-4">
      <h2 className="mb-2 text-2xl font-bold">Bài hát</h2>
      <div className="flex flex-col">
        {tracks.slice(0, 4).map((track) => (
          <SongItem
            key={track.id}
            id={track.id}
            name={track.name}
            image={track.album.images[0].url}
            singer={track.artists[0].name}
          />
        ))}
      </div>
    </section>
  );
};

export default Search;
