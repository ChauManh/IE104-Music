import React from 'react'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
        <div className='bg-black h-[15%] rounded flex flex-col justify-around'>
            <div className='flex items-center gap-3 pl-8 cursor-pointer'>
                <img className='w-6' src={assets.home_icon} alt="" />
                <p className='font-bold'>Trang Chủ</p>
            </div>
            <div className='flex items-center gap-3 pl-8 cursor-pointer'>
                <img className='w-6' src={assets.search_icon} alt="" />
                <p className='font-bold'>Tìm kiếm</p>
            </div>
        </div>
        {/* can sua lai phan home search cho giong voi thuc te */}
        <div className='bg-black h-[85%] rounded-lg'>
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