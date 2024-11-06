import React from 'react'
import { songsData } from '../assets/assets'
import SongItem from './SongItem'

const BiggestHits = () => {
  return (
    <div className='mb-6'>
            <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>
            <div className='flex overflow-auto'>
                {songsData.map((item,index)=>(<SongItem key={index} name={item.name} desc={item.desc} id={item.id} image={item.image}/>))}
            </div>
    </div>
  )
}

export default BiggestHits