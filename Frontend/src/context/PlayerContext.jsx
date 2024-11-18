import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { getWebPlayBackSDKToken } from "../util/api"

// import { getWebPlayBackSDKToken } from "../util/api";
const token = "BQDJzKq9gITQ-ZOO4l2-1bBpziK1WGt0jeD8Og6Y0B7H-X2kfUcPMykz-HSeIlbBxb_u3C0pfOaV5YfScElpBFz_UoY4toU6u5iTCsYW-2OXw-rpIA4e674g4Y2TkeotkxJg6JBPoCwb2QwIysSNFsS6QmWjLttgZ2xkAnB3bTUxdPUgdCPrHk3xSpQQrh2gS-eQf8XxLwc-s4gJoAAY-8j7-pYiH4N3obQilzDJ";
export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
    // const [token, setToken] = useState(null);
    // useEffect(() => {
    //     const fetchToken = async () => {
    //         try {
    //             const fetchedToken = await getWebPlayBackSDKToken();
    //         } catch (error) {
    //             console.error("Error fetching token:", error);
    //         }
    //     };
    //     fetchToken();
    // }, []);
    
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
            const spotifyPlayer = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => cb(token),
            });
    
            spotifyPlayer.addListener('ready', ({ device_id }) => {
                console.log('Device ready with ID:', device_id);
                setDeviceId(device_id);
                setIsDeviceReady(true); // Đã sẵn sàng
            });
    
            spotifyPlayer.connect();
            setPlayer(spotifyPlayer);
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
