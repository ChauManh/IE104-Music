import React from 'react';
import { Link } from 'react-router-dom';

const LoginRequiredPopup = ({ onClose }) => {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50"></div>
            <div className="fixed left-1/2 top-1/2 z-50 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#282828] p-6">
                <h2 className="mb-4 text-2xl font-bold text-white">Bạn cần đăng nhập để sử dụng ứng dụng</h2>
                <p className="mb-6 text-[#a7a7a7]">Đăng nhập hoặc đăng kí để có thể tận hưởng hàng triệu bảng nhạc hay nhất</p>
                
                <div className="flex flex-col gap-3">
                    <Link 
                        to="/signup"
                        className="w-full rounded-full bg-[#1ed760] px-8 py-3 text-center font-semibold text-black hover:scale-105"
                    >
                        Đăng ký
                    </Link>
                    <Link 
                        to="/signin"
                        className="w-full rounded-full border border-gray-500 px-8 py-3 text-center font-semibold text-white hover:border-white"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </>
    );
};

export default LoginRequiredPopup;