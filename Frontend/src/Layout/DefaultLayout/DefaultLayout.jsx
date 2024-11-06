import React, { useContext } from "react";
import SignupForm from "./pages/SignupForm";
import SignIn from "./pages/SignIn";
import Sidebar from "./components/sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import TopNav from "./components/TopNav";
import Queue from "./components/Queue";
import { PlayerContext } from "./context/PlayerContext";
import { QueueProvider } from "./context/QueueContext";

const App = ({children}) => {
  const { audioRef, track } = useContext(PlayerContext);

  return (
    <QueueProvider>
      <div className='h-screen bg-black'>
        <div className='h-[90%] flex'>
          <TopNav/>
          <Sidebar/>
          {children}
          <Queue/>
        </div>
        <Player/>
        <audio ref={audioRef} src={track.file} preload='auto'></audio>
      </div>
    </QueueProvider>
  );
};

export default App;
