import React from 'react'

function layout({children}) {
  return (
    <div className='m-5'>
        <h2 className='text-4xl font-bold'>HealBites</h2>
        {children} 
    </div>
  )
}

export default layout

