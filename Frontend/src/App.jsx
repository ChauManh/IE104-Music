import React from 'react'
import SignupForm from './components/SignupForm'
import SignIn from './components/SignIn'
import Sidebar from './components/sidebar'
import Player from './components/Player'
import Display from './components/Display'
import TopNav from './components/TopNav'
import Queue from './components/Queue'

const App = () => {
  return (
    <div className='h-screen bg-black'>
      <div className='h-[90%] flex'>
        <TopNav/>
        <Sidebar/>
        <Display/>
        <Queue/>
      </div>
      <Player/>
    </div>
  );
};

export default App;
