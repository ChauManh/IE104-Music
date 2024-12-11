import React from 'react'
import FeaturedCharts from './FeaturedCharts'
import BiggestHits from './BiggestHits'

const DisplayHome = () => {
  return (
    <div className="p-6">
        <FeaturedCharts/>
        <BiggestHits/>
    </div>
  )
}

export default DisplayHome