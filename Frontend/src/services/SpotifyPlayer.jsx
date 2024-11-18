import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpotifyPlayer = ({ token }) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(token),
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Device ready with ID:', device_id);
        setDeviceId(device_id); // Lưu deviceId để sử dụng cho API
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const playTrack = async (trackUri) => {
    if (!deviceId) {
      console.log('Device ID not available');
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [trackUri], // URI của bài hát bạn muốn phát
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handlePlay = () => {
    const trackUri = 'spotify:track:7fCeYpR02Q8JVuD88hJZVT'; // URI của bài hát cần phát
    playTrack(trackUri);
  };

};

export default SpotifyPlayer;
