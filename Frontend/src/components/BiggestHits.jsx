import React, { useEffect, useState } from "react";
import SongItem2 from "./SongItem2";
import { fetchPopularTracks } from "../services/trackApi";

const BiggestHits = () => {
  const [tracksData, setTrackData] = useState([]);

  useEffect(() => {
    const loadTracksData = async () => {
      try {
        const data = await fetchPopularTracks();
        setTrackData(data);
        localStorage.setItem("tracksData", JSON.stringify(data));
      } catch (error) {
        console.error("Error loading tracks data:", error);
      }
    };
    loadTracksData();
  }, []);

  return (
    <div className="mb-6 px-2 pb-2">
      <h1 className="my-5 text-2xl font-bold">Được đề xuất cho hôm nay</h1>
      <div className="album-scrollbar grid auto-cols-[200px] grid-flow-col gap-2 overflow-x-auto">
        {tracksData?.length > 0 ? (
          tracksData
            .slice(0, 10)
            .map((item, index) => (
              <SongItem2
                key={index}
                name={item.name}
                singer={item.singer}
                id={item.id}
                image={item.image}
                uri={item.uri}
                duration={item.duration}
              />
            ))
        ) : (
          <p>Loading...</p> // Hiển thị loading khi dữ liệu chưa có
        )}
      </div>
    </div>
  );
};

export default BiggestHits;
