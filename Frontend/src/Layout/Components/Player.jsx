import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { PlayerContext } from "../../context/PlayerContext";
import { useQueue } from "../../context/QueueContext";

const formatTime = (minutes, seconds) => {
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};
const Player = () => {
  const {
    track,
    setTrack,
    playStatus,
    play,
    pause,
    previousTrack,
    nextTrack,
    toggleRepeat,
    repeatStatus,
    setRepeatStatus,
    volume,
    changeVolume,
    currentTime,
    duration,
    handleTimeClick,
    addTrackToQueue,
    player,
    setCurrentTime,
  } = useContext(PlayerContext);

  const {
    toggleQueue,
    moveToNext,
    moveToPrevious,
    queue,
    previousTracks,
    setPreviousTracks,
  } = useQueue();
  const [isDragging, setIsDragging] = useState(false);
  const [localTime, setLocalTime] = useState(currentTime);
  const [repeatMode, setRepeatMode] = useState("off"); // "off", "track", "context"

  useEffect(() => {
    if (player) {
      player.getRepeatMode().then((mode) => {
        setRepeatStatus(mode === 0 ? "off" : mode === 1 ? "track" : "context");
      });
    }
  }, [player]);

  const handleNext = async () => {
    if (queue.length === 0) return;
    setPreviousTracks((prev) => [...prev, track]);
    const trackData = queue[0];
    setTrack(trackData);
    nextTrack(trackData.uri);
    await moveToNext();
    addTrackToQueue(queue[0].uri);
  };

  const handlePrevious = () => {
    if (previousTracks.length === 0) return;
    const trackData = previousTracks[previousTracks.length - 1];
    setPreviousTracks(previousTracks.slice(0, -1));
    setTrack(trackData);
    moveToPrevious();
    previousTrack(trackData.uri);
    addTrackToQueue(queue[0].uri);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Seek to the new position when mouse is released
      player.seek(localTime * 1000);
      setCurrentTime(localTime);
      // Resume playback if it was playing before
      if (playStatus) {
        player.resume();
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / progressBar.offsetWidth;
      const newTime = percent * duration;
      setLocalTime(newTime);
      // Update position in real-time while dragging
      player.seek(newTime * 1000);
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 flex min-h-[9%] items-center justify-between bg-zinc-900 px-[2vw] text-white">
      {/* Left  */}
      <div className="hidden min-h-[100%] w-[30%] items-center gap-4 lg:flex">
        {track.image ? (
          <img
            className="mb-2 mt-2 h-14 min-h-[100%] w-14 rounded"
            src={track.image}
            alt=""
          />
        ) : (
          ""
        )}

        <div>
          <p className="cursor-pointer text-sm hover:underline">{track.name}</p>
          <p className="cursor-pointer text-xs text-gray-400 hover:underline">
            {track.singer}
          </p>
        </div>
      </div>

      {/* Center  */}
      <div className="mb-2 mt-2 flex w-[40%] flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-4">
          <img
            className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
            src={assets.shuffle_icon}
            alt=""
          />
          <img
            onClick={handlePrevious}
            className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
            src={assets.prev_icon}
            alt=""
          />
          <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#181818] transition-transform hover:scale-105">
            {playStatus ? (
              <img
                onClick={pause}
                className="h-4 w-4"
                src={assets.pause_icon}
                alt=""
              />
            ) : (
              <img
                onClick={play}
                className="h-4 w-4"
                src={assets.play_icon}
                alt=""
              />
            )}
          </div>
          <img
            onClick={handleNext}
            className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
            src={assets.next_icon}
            alt=""
          />
          <img
            onClick={toggleRepeat}
            className="h-[14px] w-[14px] cursor-pointer opacity-70 transition-all hover:opacity-100"
            src={
              repeatStatus === "track"
                ? assets.repeated_icon
                : repeatStatus === "context"
                  ? assets.repeatall_icon
                  : assets.repeat_icon
            }
            alt="Repeat"
            title={
              repeatMode === "track"
                ? "Repeat current track"
                : repeatMode === "context"
                  ? "Repeat entire album"
                  : "Repeat off"
            }
          />
        </div>

        {/* PlayBar */}
        <div className="group mb-2 flex w-full items-center gap-2">
          <span className="w-10 text-right text-xs text-gray-400">
            {formatTime(
              Math.floor(isDragging ? localTime / 60 : currentTime / 60),
              Math.floor(isDragging ? localTime % 60 : currentTime % 60),
            )}
          </span>
          <div
            onClick={handleTimeClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsDragging(false)}
            className="relative h-1 flex-1 cursor-pointer rounded-full bg-[#4d4d4d] group-hover:h-1.5"
          >
            <div
              className="absolute h-full rounded-full bg-[#1db954] group-hover:bg-[#1ed760]"
              style={{
                width: `${((isDragging ? localTime : currentTime) / duration) * 100}%`,
              }}
            />
            <div
              style={{
                left: `${((isDragging ? localTime : currentTime) / duration) * 100}%`,
              }}
              className="absolute h-3 w-3 -translate-y-1/3 rounded-full bg-white opacity-0 group-hover:opacity-100"
            />
          </div>
          <span className="w-10 text-xs text-gray-400">
            {formatTime(Math.floor(duration / 60), Math.floor(duration % 60))}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="hidden w-[30%] items-center justify-end gap-4 lg:flex">
        <img
          className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
          src={assets.plays_icon}
          alt=""
        />
        <img
          className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
          src={assets.mic_icon}
          alt=""
        />
        <img
          className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
          onClick={toggleQueue}
          src={assets.queue_icon}
          alt=""
        />
        <img
          className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
          src={assets.speaker_icon}
          alt=""
        />
        <div className="group flex items-center gap-2">
          <img
            className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
            src={assets.volume_icon}
            alt=""
          />
          <div className="relative flex w-24 items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="my-auto h-1 w-full cursor-pointer appearance-none rounded-full transition-colors duration-200 ease-in-out group-hover:h-1.5"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume * 100}%, #4d4d4d ${volume * 100}%, #4d4d4d 100%)`,
                transition: "background 0.2s ease-in-out",
              }}
            />
          </div>
        </div>
        <img
          className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
          src={assets.mini_player_icon}
          alt=""
        />
        <img
          className="h-4 w-4 cursor-pointer opacity-70 transition-all hover:opacity-100"
          src={assets.zoom_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default Player;
