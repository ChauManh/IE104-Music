import React from 'react'
import SignupForm from './components/SignupForm'
import SignIn from './components/SignIn'
import Sidebar from './components/sidebar'
import Player from './components/Player'
import Display from './components/Display'

const App = () => {
  return (
    <div className='h-screen bg-[#121212]'>
      <div className='h-[90%] flex'>
        <Sidebar/>
        <Display/>
      </div>
      <Player/>
    </div>
  );
};

export default App;
