import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { getWebPlayBackSDKToken } from "../util/api"

// import { getWebPlayBackSDKToken } from "../util/api";
const token = "BQBapOXAF_apF8gLPNNYnwqfO6pdMKD6vAS0CDWnbxeK0WvSF44rsOSRdCV3Q_rO3ZSR_UZTHiwLQNRiL3z3sKfSwrjfSD9vyCj51H1xnxcMCtfzJ6FCCDCX8GengEfVmBCXqI97lvpuheznnNqxHDru62G7BHnoEQ8oC8ojjjbgfV-q3E2TyMyItAT1DVT9wk0uweF15gwNVZbOSTsjukDqbhF8Cno63kdOYHE7";
export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
    
    const [track, setTrack] = useState({
        name: '',
        image: '',
        singer: '',
        id: '',
        uri: '',
        duration: ''
    });

    const [player, setPlayer] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [deviceId, setDeviceId] = useState(null);
    const [isDeviceReady, setIsDeviceReady] = useState(false); // Trạng thái chờ


    // Cấu hình Web Playback SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.1
            });

            setPlayer(player);
    
            player.addListener('ready', ({ device_id }) => {
                console.log('Device ready with ID:', device_id);
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
    }, []);

    const play = () => {
        player.resume().then(() => {
            console.log('Resumed!');
        });
        setPlayStatus(true);
    };

    const pause = () => {
        player.pause().then(() => {
            console.log('Paused!');
        });
        setPlayStatus(false);
    };

    const playWithUri = async (uri) => {
        if (!deviceId) {
            console.log('Device ID not available');
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
                }
            );
            setTrack((prevTrack) => ({ ...prevTrack, uri }));
            setPlayStatus(true);
                player.getCurrentState().then(state => {
                    if (!state) {
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                    }
                
                    var current_track = state.track_window.current_track;
                    var next_track = state.track_window.next_tracks[0];
                
                    console.log('Currently Playing', current_track);
                    console.log('Playing Next', next_track);
                });
        } catch (error) {
            console.error('Error while playing track with URI:', error);
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

    if (!isDeviceReady) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"></div>
                <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
