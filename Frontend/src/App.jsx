import React from 'react'
import SignupForm from './components/SignupForm'
import SignIn from './components/SignIn'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <div className='bg-[#121212]'>
      <div className='h-[90%] flex'>
        <SignupForm/>
      </div>
    </div>
  )
}

export default App  