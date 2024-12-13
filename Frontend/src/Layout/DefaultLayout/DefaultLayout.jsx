import TopNav from '../Components/TopNav';
import Sidebar from '../Components/sidebar';
import Player from '../Components/Player';
import Queue from "../../components/Queue";
import { PlayerContext } from "../../context/PlayerContext";
import { QueueProvider } from "../../context/QueueContext";
import React, { useContext, memo } from "react";

// Memoize the Sidebar and Queue components
const MemoizedSidebar = memo(Sidebar);
const MemoizedQueue = memo(Queue);

const DefaultLayout = ({ children }) => {
    const { audioRef, track } = useContext(PlayerContext);

    return (
        <QueueProvider>
            <div className='h-screen bg-black'>
                <div className='h-[90%] flex'>
                    <TopNav/>
                    <MemoizedSidebar/>
                    {children}
                    <MemoizedQueue/>
                </div>
                <Player/>
                <audio ref={audioRef} src={track.file} preload='auto'></audio>
            </div>
        </QueueProvider>
    );
};

export default memo(DefaultLayout);