import React from 'react'

function Section({children}) {
  return (
    <div className='px-2 bg-none'>
      <div className='px-2 py-2 bg-white my-2 rounded-md shadow-md'>
      {children}
      </div>
    </div>
  )
}

export default Section
