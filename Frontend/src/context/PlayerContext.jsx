import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { refreshAccessToken } from "../utils/refresh_webplaybacksdk_token";
import { useQueue } from "./QueueContext";
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
  const [albumsData, setAlbumData] = useState([]);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [player, setPlayer] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false); // Trạng thái chờ
  const [token, setToken] = useState(null); // Token state
  const [tokenReady, setTokenReady] = useState(false); // Trạng thái token đã sẵn sàng
  const [repeatStatus, setRepeatStatus] = useState("off");
  const [volume, setVolume] = useState(0.2); // Mặc định là 20%
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const {
    moveToNext,
    moveToPrevious,
    queue,
    previousTracks,
    setPreviousTracks,
  } = useQueue();

  useEffect(() => {
    if (!player) return;
    player.addListener("authentication_error", async () => {
      const refreshedToken = await refreshAccessToken(); // Làm mới token
      if (refreshedToken) {
        player.setOAuthToken(refreshedToken); // Cập nhật token mới cho player
        setToken(refreshedToken); // Cập nhật token trong state
      } else {
        console.error("Failed to refresh token.");
      }
    });
  }, [player]);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const web_playback_token = localStorage.getItem("web_playback_token");
        setToken(web_playback_token);
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
      return; // Dừng lại nếu token chưa sẵn sàng
    }
    if (player) {
      player.setOAuthToken(token);
    } else {
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
          volume: volume,
        });

        setPlayer(player);

        player.addListener("ready", ({ device_id }) => {
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
    }
  }, [tokenReady, token]);

  useEffect(() => {
    if (!player) return;
    setDuration(track.duration / 1000);
    const interval = setInterval(() => {
      player.getCurrentState().then((state) => {
        if (state) {
          setCurrentTime(state.position / 1000); // Cập nhật thời gian hiện tại
          if (state.paused && state.position === 0) {
            clearInterval(interval);
            setPlayStatus(false);
            handleNext();
          }
        }
      });
    }, 500);
    return () => clearInterval(interval);
  }, [queue]);

  const play = () => {
    player.resume().then(() => {});
    setPlayStatus(true);
  };

  const pause = () => {
    player.pause().then(() => {});
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
      // setTrack((prevTrack) => ({ ...prevTrack, uri }));
      setPlayStatus(true);
    } catch (error) {
      console.error("Error while playing track with URI:", error);
    }
  };

  const toggleRepeat = () => {
    const newRepeatStatus =
      repeatStatus === "off"
        ? "track"
        : repeatStatus === "track"
          ? "context"
          : "off";
    setRepeatStatus(newRepeatStatus);
    axios
      .put(
        `https://api.spotify.com/v1/me/player/repeat?state=${newRepeatStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {})
      .catch((error) => {
        console.error(
          "Error setting repeat mode:",
          error.response?.data || error.message,
        );
      });
  };

  const changeVolume = (newVolume) => {
    if (player) {
      player.setVolume(newVolume).then(() => {
        setVolume(newVolume); // Cập nhật state volume
      });
    } else {
      console.log("Player chưa sẵn sàng.");
    }
  };

  const handleTimeClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / progressBar.offsetWidth;
    const newTime = percent * duration;
    player.seek(newTime * 1000);
    setCurrentTime(newTime);
  };

  const addTrackToQueue = async (trackUri) => {
    try {
      await axios.post(`https://api.spotify.com/v1/me/player/queue`, null, {
        params: {
          uri: trackUri,
          device_id: deviceId, // Sử dụng deviceId hiện tại
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error setting playback queue:", error);
    }
  };

  const handleNext = async () => {
    if (queue.length === 0) return;
    setPreviousTracks((prev) => [...prev, track]);
    const trackData = queue[0];
    await playWithUri(trackData.uri);
    setTrack(trackData);
    setPlayStatus(true);
    moveToNext();
  };

  const handlePrevious = async () => {
    if (previousTracks.length === 0) return;
    const trackData = previousTracks[previousTracks.length - 1];
    setPreviousTracks(previousTracks.slice(0, -1));
    await playWithUri(trackData.uri);
    setTrack(trackData);
    moveToPrevious();
  };

  const contextValue = {
    track,
    setTrack,
    albumTracks,
    setAlbumTracks,
    albumsData,
    setAlbumData,
    playStatus,
    setPlayStatus,
    play,
    pause,
    playWithUri,
    deviceId,
    repeatStatus,
    toggleRepeat,
    volume,
    setVolume,
    changeVolume,
    currentTime,
    duration,
    isDeviceReady,
    handleTimeClick,
    addTrackToQueue,
    handleNext,
    handlePrevious,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
