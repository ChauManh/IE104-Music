import React, {useEffect, useRef} from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import DisplaySong from './DisplaySong'
import { albumsData } from '../assets/assets'

const Display = () => { 
    const displayRef=useRef();
    const location= useLocation();
    const isAlbum =location.pathname.includes("album");
    const albumId=  isAlbum ? location.pathname.slice(-1) : "";
    const bgColor =albumsData[Number(albumId)].bgColor;

    useEffect(()=>{
      if (isAlbum){
        displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`
      }
      else{
        displayRef.current.style.background = '#121212'
      }
    })
  return (
    <div ref={displayRef} className='px-6 rounded-3xl bg-[#121212] text-white overflow-auto lg:w-[100%] lg:ml-0 mt-14'>
        <Routes>
            <Route path='/' element={<DisplayHome/>} />
            <Route path='/album/:id' element={<DisplayAlbum/>} />
            <Route path='/song/:id' element={<DisplaySong/>} />
        </Routes>
    </div>
  )
}

export default Display