import React from 'react'
import Navbar from './Navbar'

import FeaturedCharts from './FeaturedCharts'
import BiggestHits from './BiggestHits'

const DisplayHome = () => {
  return (
    <div className="p-6">
        <Navbar/>
        <FeaturedCharts/>
        <BiggestHits/>
    </div>
  )
}

export default DisplayHome