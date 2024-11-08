import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AlbumItem = ({image, name, singer, id}) => {

    const navigate = useNavigate()
    const handleClick = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/album/${id}/tracks`);
        console.log(response.data);
        navigate(`/album/${id}/tracks`);
        alert('Inspect ra mà xem dữ liệu chứ chưa xong tính năng này')
      } catch (error) {
        alert('Error fetching track:', error.message);
      }
    };

  return (
    <div onClick={handleClick} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
        <img className='rounded' src={image} alt="" />
        <p className='font-bold mt-2 mb-1'>{name}</p>
        <p className='text-slate-200 text-sm'>{singer}</p>
    </div>
  )
}

export default AlbumItem