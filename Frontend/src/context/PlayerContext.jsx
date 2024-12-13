import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { getWebPlayBackSDKToken } from "../util/api";
import useTokenRefresh from "../services/refresh_webplaybacksdk_token";
// import { QueueProvider, useQueue } from "./QueueContext";
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
  // const [queue, currentTrackIndex] = useQueue();

  // const next = () => {
  //   const nextTrack = queue[currentTrackIndex];
  //   console.log(nextTrack);
  //   setTrack(nextTrack);
  //   playWithUri(nextTrack.uri);
  // }
  // useTokenRefresh((newToken) => {
  //   console.log("Token refreshed and callback triggered:", newToken);
  //   setToken(newToken); // Cập nhật token vào state
  //   if (player) {
  //     player.setOAuthToken((cb) => cb(newToken)); // Cập nhật token cho player
  //     console.log("Player token đã được cập nhật:", newToken);
  //   }
  // });
  

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
        volume: volume,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Device ready with ID:", device_id);
        setDeviceId(device_id);
        setIsDeviceReady(true); // Đã sẵn sàng
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          console.log("Player state is null");
          return;
        }
  
        const { paused, position, duration } = state;
        setCurrentTime(position / 1000);
        setDuration(duration / 1000);
        if (paused && position === 0 && duration > 0) {
          setPlayStatus(false);
          console.log("Track ended");
          // player.nextTrack().then(() => {
          //   console.log('Skipped to next track!');
          // });
        }
        const interval = setInterval(() => {
          player.getCurrentState().then((state) => {
            if (state) {
              setCurrentTime(state.position / 1000); // Cập nhật thời gian hiện tại
            }
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [player]);

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
    getQueueState();
  };

  const pause = () => {
    player.pause().then(() => {
      console.log("Paused!");
    });
    setPlayStatus(false);
    getQueueState();
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
      setTimeout(() => {
        player.getCurrentState().then((state) => {
          if (!state) {
            console.error(
              "User is not playing music through the Web Playback SDK",
            );
            return;
          }
          console.log("Repeat", state.repeat_mode);
          console.log(repeatStatus);
        });
      }, 500);
    } catch (error) {
      console.error("Error while playing track with URI:", error);
    }
  };

  const toggleRepeat = () => {
  
    const newRepeatStatus = 
    repeatStatus === "off" ? "track" : 
    repeatStatus === "track" ? "context" : 
    "off";

    setRepeatStatus(newRepeatStatus);

    axios.put(
      `https://api.spotify.com/v1/me/player/repeat?state=${newRepeatStatus}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      console.log('Response from API:', response.data);
      console.log(repeatStatus);
    })
    .catch(error => {
      console.error('Error setting repeat mode:', error.response?.data || error.message);
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
    const progressBar = e.target;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBar.offsetWidth) * duration;
    player.seek(newTime * 1000); 
    setCurrentTime(newTime);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const addTrackToQueue = async (trackUri) => {
    try {
        const response = await axios.post(
        `https://api.spotify.com/v1/me/player/queue`,      
         null,
        {
          params: { uri: trackUri },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Track ${trackUri} added to queue successfully`);
    } catch (error) {
      console.error("Error setting playback queue:", error);
    }
  };

  const addTracksToQueue = async (queue) => {
    for (let i = 0; i < queue.length; i++) {
      await addTrackToQueue(queue[i].uri); // Gửi request
      await delay(500); // Thêm delay 500ms giữa các request
    }
  };

  const getQueueState = () => {
    player.getCurrentState().then(state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }
    
      var current_track = state.track_window.current_track;
      var next_track = state.track_window.next_tracks;
    
      console.log('Currently Playing', current_track);
      console.log('Playing Next', next_track);
    });
  };

  const nextTrack = () => {
    player.nextTrack().then(() => {
      console.log('Skipped to next track!');
    });
  }

  const previousTrack = () => {
    player.previousTrack().then(() => {
      console.log('Skipped to previous track!');
    });
  }

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
    handleTimeClick,
    addTracksToQueue,
    nextTrack,
    previousTrack
    // next,
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
