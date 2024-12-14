import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { PlayerContext } from '../../context/PlayerContext'
import { useQueue } from '../../context/QueueContext';

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
        repeatStatus,
        toggleRepeat, 
        volume,
        changeVolume,
        currentTime,
        duration, 
        handleTimeClick,
        addTrackToQueue,
        player,
        setCurrentTime
    } = useContext(PlayerContext);

    const { toggleQueue, moveToNext, moveToPrevious, queue, previousTracks, setPreviousTracks } = useQueue();
    const [isDragging, setIsDragging] = useState(false);
    const [localTime, setLocalTime] = useState(currentTime);

    const handleNext = async () => {
        if (queue.length === 0) return;
        setPreviousTracks((prev) => [...prev, track]);
        console.log("list", previousTracks)
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
    <div className='fixed bottom-0 left-0 right-0  min-h-[9%]  bg-zinc-900 flex justify-between items-center text-white px-[2vw] z-10'>
        {/* Left  */}
        <div className='hidden lg:flex items-center gap-4 w-[30%] min-h-[100%]'>
            { track.image ? <
                img className='mt-2 mb-2 w-14 h-14 min-h-[100%] rounded' src={track.image} alt="" /> : "" }
            
            <div>
                <p className='text-sm hover:underline cursor-pointer'>{track.name}</p>
                <p className='text-xs text-gray-400 hover:underline cursor-pointer'>{track.singer}</p>
            </div>
        </div>

        {/* Center  */}
        <div className='mt-2 mb-2 flex flex-col items-center justify-center gap-2 w-[40%]'>
            <div className='flex items-center justify-center gap-4'>
                <img 
                    className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' 
                    src={assets.shuffle_icon} 
                    alt="" 
                />
                <img 
                    onClick={handlePrevious} 
                    className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' 
                    src={assets.prev_icon} 
                    alt="" 
                />
                <div className='w-6 h-6 flex items-center justify-center bg-[#181818] rounded-full hover:scale-105 transition-transform cursor-pointer'>
                    {playStatus ? (
                        <img onClick={pause} className='w-4 h-4' src={assets.pause_icon} alt="" />
                    ) : (
                        <img onClick={play} className='w-4 h-4' src={assets.play_icon} alt="" />
                    )}
                </div>
                <img 
                    onClick={handleNext} 
                    className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' 
                    src={assets.next_icon} 
                    alt="" 
                />
                <img 
                    onClick={toggleRepeat} 
                    className={`w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all ${repeatStatus ? 'text-green-500' : ''}`} 
                    src={assets.loop_icon} 
                    alt="" 
                />
            </div>

            {/* PlayBar */}
            <div className="mb-2 flex items-center gap-2 w-full group">
                <span className="text-xs text-gray-400 w-10 text-right">
                    {formatTime(Math.floor(isDragging ? localTime / 60 : currentTime / 60), 
                               Math.floor(isDragging ? localTime % 60 : currentTime % 60))}
                </span>
                <div 
                    onClick={handleTimeClick} 
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setIsDragging(false)}
                    className="relative flex-1 h-1 bg-[#4d4d4d] rounded-full cursor-pointer group-hover:h-1.5"
                >
                    <div 
                        className="absolute h-full bg-[#1db954] group-hover:bg-[#1ed760] rounded-full"
                        style={{ 
                            width: `${((isDragging ? localTime : currentTime) / duration) * 100}%`
                        }}
                    />
                    <div 
                        style={{ 
                            left: `${((isDragging ? localTime : currentTime) / duration) * 100}%`
                        }}
                        className="absolute w-3 h-3 -translate-y-1/3 bg-white rounded-full opacity-0 group-hover:opacity-100"
                    />
                </div>
                <span className="text-xs text-gray-400 w-10">
                    {formatTime(Math.floor(duration / 60), Math.floor(duration % 60))}
                </span>
            </div>
        </div>

        {/* Right */}
        <div className='hidden lg:flex items-center gap-4 w-[30%] justify-end'>
            <img className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' src={assets.plays_icon} alt="" />
            <img className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' src={assets.mic_icon} alt="" />
            <img 
                className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' 
                onClick={toggleQueue} 
                src={assets.queue_icon} 
                alt="" 
            />
            <img className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' src={assets.speaker_icon} alt="" />
            <div className='group flex items-center gap-2'>
                <img
                    className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all'
                    src={assets.volume_icon}
                    alt=""
                />
                <div className="relative w-24 flex items-center">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => changeVolume(parseFloat(e.target.value))}
                        className="w-full h-1 appearance-none rounded-full group-hover:h-1.5 transition-colors duration-200 ease-in-out cursor-pointer my-auto" 
                        style={{
                            background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume * 100}%, #4d4d4d ${volume * 100}%, #4d4d4d 100%)`,
                            transition: 'background 0.2s ease-in-out'
                        }}
                    />
                </div>
            </div>
            <img className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' src={assets.mini_player_icon} alt="" />
            <img className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' src={assets.zoom_icon} alt="" />
        </div>
    </div>
  );
};

export default Player;
