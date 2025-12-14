import React from 'react'

function Section({children, className}) {
  return (
    // <div className='  max-w-500 px-2 py-2 bg-white my-2 rounded-md shadow-md self-center-safe'>
    <div className={`px-2 py-2 bg-white my-2 rounded-md shadow-md self-center-safe ${className}`}>
      {children}
    </div>
  )
}

export default Section
