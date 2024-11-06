import React, { useState } from 'react';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div
      className={`${isSidebarExpanded ? 'min-w-[20%]' : 'min-w-[40%]'} 
                  max-h-full pl-2 pr-2 flex-col gap-2 text-white hidden lg:flex mt-16 transition-all duration-300`}
    >
      <div className='bg-[#121212] h-[100%] rounded-3xl'>
        <div className='p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3 cursor-default'>
            <img className='w-8' src={assets.stack_icon} alt="" />
            <p className='font-semibold'>
              Thư viện
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <img
              className='w-5 flex cursor-pointer rounded-full transition-transform duration-300 hover:scale-110'
              src={assets.plus_icon}
              alt=""
              title='Tạo danh sách phát và thư mục'
            />
            <img
              className='w-5 flex cursor-pointer rounded-full transition-transform duration-300 hover:scale-110'
              src={isSidebarExpanded ? assets.arrow_icon : assets.arrow_rotate_icon}
              alt=""
              onClick={toggleSidebar}
            />
          </div>
        </div>
        <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
          <h1>Tạo danh sách phát đầu tiên của bạn</h1>
          <p className='font-light'>Rất dễ! Chúng tôi sẽ giúp bạn</p>
          <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>
            Tạo danh sách phát
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;