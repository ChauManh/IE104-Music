import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate= useNavigate()
  return (
    <>
        <div className='flex items-center gap-2 mt-4 rounded-2xl'>
            <p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hover:bg-zinc-200'>Tất cả</p>  
            <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer hover:bg-zinc-900'>Nhạc</p>
            <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer hover:bg-zinc-900'>Album</p>
            <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer hover:bg-zinc-900'>Nghệ sĩ</p>
        </div>
    </>
  )
}

export default Navbar