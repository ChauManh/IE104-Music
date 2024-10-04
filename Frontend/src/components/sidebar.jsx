import React from 'react'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex mt-16 '>
        <div className='bg-[#121212] h-[92%] rounded'>
            <div className='p-4 flex items-center justify-between'>
                <div className=' flex items-center gap-3 cursor-pointer'>
                    <img className='w-8' src={assets.stack_icon} alt="" />
                    <p className='font-semibold'>Thư viện</p>
                </div>
                <div className='flex items-center gap-3'> 
                    <img className='w-5' src={assets.plus_icon} alt="" />
                    <img className='w-5' src={assets.arrow_icon} alt="" />
                </div>
            </div>
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                <h1>Tạo danh sách phát đầu tiên của bạn</h1>
                <p className='font-light'>Rất dễ! Chúng tôi sẽ giúp bạn</p>
                <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Tạo danh sách phát</button>
            </div>
        </div>
    </div>
  )
}

export default Sidebar