import React from 'react'
import { assets } from '../assets/assets'

const TopNav = () => {
  return (
    <div className="w-full text-white p-4 bg-black fixed top-0 left-0 flex justify-between">
        <div className='flex items-center gap-3 cursor-pointer bg-gray-700 p-2 rounded-full'>
            <img className='w-6' src={assets.home_icon} alt="" />
        </div>
        <div className=' flex items-center gap-3 pl-8 cursor-pointer'>
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="bg-gray-800 text-white border rounded-l-full rounded-r-full border-gray-600 rounded-lg p-2 pl-10 pr-10"
                />
                <img
                    src={assets.search_icon}
                    alt=""
                    className="absolute left-3 top-2 w-6"
                />
            </div>
        </div>
        <div className='flex items-center justify-between gap-3 pl-8 cursor-pointer'>
            TK
        </div>
    </div>
  )
}

export default TopNav