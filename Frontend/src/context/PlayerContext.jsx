import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const [track, setTrack] = useState(songsData[1]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    });

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };

    const playWithId = async (id) => {
        await setTrack(songsData[id]);
        audioRef.current.play();
        setPlayStatus(true);
    };

    const previous = async () => {
        if (track.id > 0) {
            await setTrack(songsData[track.id - 1]);
        } else {
            setTrack(songsData[songsData.length - 1]);
        }
        audioRef.current.play();
        setPlayStatus(true);
    };

    const next = async () => {
        if (track.id < songsData.length - 1) {
            await setTrack(songsData[track.id + 1]);
        } else {
            setTrack(songsData[0]);
        }
        audioRef.current.play();
        setPlayStatus(true);
    };

    const seekSong = (e) => {
        if (audioRef.current && audioRef.current.duration) {
            const seekPosition = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
            audioRef.current.currentTime = seekPosition;
            play();
        }
    };

    useEffect(() => {
        const updateTime = () => {
            if (audioRef.current && audioRef.current.duration) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                seekBar.current.style.width = `${(currentTime / duration) * 100}%`;
                setTime({
                    currentTime: {
                        second: Math.floor(currentTime % 60),
                        minute: Math.floor(currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(duration % 60),
                        minute: Math.floor(duration / 60)
                    }
                });
            }
        };

        // Đảm bảo duration có sẵn sau khi audio tải xong
        const onLoadedMetadata = () => {
            setTime((prevTime) => ({
                ...prevTime,
                totalTime: {
                    second: Math.floor(audioRef.current.duration % 60),
                    minute: Math.floor(audioRef.current.duration / 60)
                }
            }));
        };

        if (audioRef.current) {
            audioRef.current.addEventListener("loadedmetadata", onLoadedMetadata);
            audioRef.current.ontimeupdate = updateTime;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("loadedmetadata", onLoadedMetadata);
                audioRef.current.ontimeupdate = null;
            }
        };
    }, [track]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;