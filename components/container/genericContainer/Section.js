import React from 'react'

function Section({children, className}) {
  return (
    <div className=' px-0 pt-1 md:px-2  bg-none w-full '>
      <div className={`px-2 py-1 md:py-2 bg-white md:rounded-sm shadow-md`} >
      {children}
      </div>
    </div>
  )
}

export default Section
