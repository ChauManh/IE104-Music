import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { getWebPlayBackSDKToken } from "../util/api";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const [track, setTrack] = useState({
    name: "",
    image: "",
    singer: "",
    id: "",
    uri: "",
    duration: "",
  });
  const [player, setPlayer] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false); // Trạng thái chờ
  const [token, setToken] = useState(null); // Token state
  const [tokenReady, setTokenReady] = useState(false); // Trạng thái token đã sẵn sàng

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await getWebPlayBackSDKToken();
        setToken(response.access_token);
        setTokenReady(true); 
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    getAccessToken();
  }, []);

  // Cấu hình Web Playback SDK
  useEffect(() => {
    if (!tokenReady || !token) {
      console.log("Token chưa sẵn sàng, chờ đợi...");
      return; // Dừng lại nếu token chưa sẵn sàng
    }
    console.log("Token sẵn sàng", token);
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Device ready with ID:", device_id);
        setDeviceId(device_id);
        setIsDeviceReady(true); // Đã sẵn sàng
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [tokenReady, token]);

  const play = () => {
    player.resume().then(() => {
      console.log("Resumed!");
    });
    setPlayStatus(true);
  };

  const pause = () => {
    player.pause().then(() => {
      console.log("Paused!");
    });
    setPlayStatus(false);
  };

  const playWithUri = async (uri) => {
    if (!deviceId) {
      console.log("Device ID not available");
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [uri], // URI của bài hát
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTrack((prevTrack) => ({ ...prevTrack, uri }));
      setPlayStatus(true);
      player.getCurrentState().then((state) => {
        if (!state) {
          console.error(
            "User is not playing music through the Web Playback SDK",
          );
          return;
        }

        var current_track = state.track_window.current_track;
        var next_track = state.track_window.next_tracks[0];

        console.log("Currently Playing", current_track);
        console.log("Playing Next", next_track);
      });
    } catch (error) {
      console.error("Error while playing track with URI:", error);
    }
  };

  const contextValue = {
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    play,
    pause,
    playWithUri,
    deviceId,
  };

  // if (!isDeviceReady) {
  //   return (
  //     <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
  //       <div className="h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-green-500"></div>
  //       <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
