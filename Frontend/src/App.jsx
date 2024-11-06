import React, { useContext } from "react";
import SignupForm from "./pages/SignupForm";
import SignIn from "./pages/SignIn";
import Sidebar from "./components/sidebar";
import Player from "./components/Player";
import Display from "./pages/Display";
import TopNav from "./components/TopNav";
import Queue from "./components/Queue";
import { PlayerContext } from "./context/PlayerContext";
import { QueueProvider } from "./context/QueueContext";

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);

  return (
    <QueueProvider>
      <div className='h-screen bg-black'>
        <div className='h-[90%] flex'>
          <TopNav/>
          <Sidebar/>
          <Display/>
          <Queue/>
        </div>
        <Player/>
        <audio ref={audioRef} src={track.file} preload='auto'></audio>
      </div>
    </QueueProvider>
    // <div className="bg-black">
    //   <SignupForm></SignupForm>
    // </div>
  );
};

export default App;
