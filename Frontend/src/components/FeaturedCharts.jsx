import React from 'react'
import { albumsData } from '../assets/assets'
import AlbumItem from './AlbumItem'

const FeaturedCharts = () => {
  return (
    <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
            <div className='flex overflow-auto'>
                {albumsData.map((item,index)=>(<AlbumItem key={index} name={item.name} desc={item.desc} id={item.id} image={item.image}/>))}
            </div>
    </div>
  )
}

export default FeaturedCharts