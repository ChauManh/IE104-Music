import React, { useContext } from 'react'
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
        playStatus, 
        play, 
        pause, 
        // previous, 
        nextTrack, 
        repeatStatus, // Lấy trạng thái repeat từ context
        toggleRepeat, // Lấy hàm toggleRepeat từ context
        volume,
        changeVolume,
        currentTime,
        duration, 
        handleTimeClick,
    } = useContext(PlayerContext);

    const { toggleQueue, moveToNext, moveToPrevious } = useQueue();

    const handleNext = () => {
        moveToNext();
        nextTrack();
    };

    const handlePrevious = () => {
        moveToPrevious();
        // previous();
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
                    {formatTime(Math.floor(currentTime / 60), Math.floor(currentTime % 60))}
                </span>
                <div 
                    onClick={handleTimeClick} 
                    className="relative flex-1 h-1 bg-[#4d4d4d] rounded-full cursor-pointer group-hover:h-1.5 transition-all"
                >
                    <div 
                        className="absolute h-full bg-[#1db954] group-hover:bg-[#1ed760] rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div 
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                        className="absolute w-3 h-3 -translate-y-1/3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-100"
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
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className='w-24 h-1 bg-[#1db954] rounded-full group-hover:h-1.5 transition-all cursor-pointer'
                />
            </div>
            <img className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' src={assets.mini_player_icon} alt="" />
            <img className='w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-all' src={assets.zoom_icon} alt="" />
        </div>
    </div>
  );
};

export default Player;
