import React, { useContext } from 'react'
import SignupForm from './components/SignupForm'
import SignIn from './components/SignIn'
import Sidebar from './components/sidebar'
import Player from './components/Player'
import Display from './components/Display'
import TopNav from './components/TopNav'
import Queue from './components/Queue'
import { PlayerContext } from './context/PlayerContext'

const App = () => {

  const {audioRef,track} = useContext(PlayerContext)

  return (
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
  );
};

export default App;
