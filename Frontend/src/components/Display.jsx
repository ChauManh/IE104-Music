import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import DisplaySong from './DisplaySong'

const Display = () => { 
  return (
    <div className='px-6 rounded-3xl bg-[#121212] text-white overflow-auto lg:w-[60%] lg:ml-0 mt-14'>
        <Routes>
            <Route path='/' element={<DisplayHome/>} />
            <Route path='/album/:id' element={<DisplayAlbum/>} />
            <Route path='/song/:id' element={<DisplaySong/>} />
        </Routes>
    </div>
  )
}

export default Display