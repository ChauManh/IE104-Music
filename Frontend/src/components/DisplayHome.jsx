import React from 'react'
import Navbar from './Navbar'

import FeaturedCharts from './FeaturedCharts'
import BiggestHits from './BiggestHits'

const DisplayHome = () => {
  return (
    <>
        <Navbar/>
        <FeaturedCharts/>
        <BiggestHits/>
    </>
  )
}

export default DisplayHome