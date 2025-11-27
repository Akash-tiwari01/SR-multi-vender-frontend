"use client"
import React, { useState } from 'react'
import {  ChevronsRight, Crosshair, XCircle, ZoomInIcon } from 'lucide-react';
import Image from 'next/image'
import {min, getImageUrl} from  '../utils/helperFunction'
import ImageMagnifier from './ImageMagnifier';



function ProductImage({images}) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const visibleThumbs = 4
    const showViewMore = images.length > visibleThumbs
  
    return (
    <div className="h-[80vh] col-span lg:col-span-6 flex gap-6">
          {/* thumbnails vertical */}
          <div className="hidden sm:flex flex-col gap-4 w-20 items-center">
            {images.slice(0, min(5,images.length)).map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`w-full h-20 relative  rounded   ${selectedIndex === i ? 'ring-2 ring-rose-800' : ''}`}
              >
                <Image
                  src={getImageUrl(src)}
                  alt={`thumb-${i}`}
                  fill
                  sizes="80px"
                  className="object-cover rounded"
                  unoptimized={true}
                />
              </button>
            ))}

            {showViewMore && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-0 bg-white  rounded flex items-center justify-center text-[9px]  text-rose-800 font-medium hover:text-rose-950"
              >
                View more <ChevronsRight className='h-2.5'/>
              </button>
            )}
          </div>

          {/* Large image box */}
          <div className="  rounded  flex flex-col justify-center items-start w-full">
            <div className="relative bg-amber-900 w-full rounded-md">
              <ImageMagnifier src={getImageUrl(images[selectedIndex])}/>
              <div className='absolute bottom-2 right-2'>
              <div class="group ">
                <button className='  bg-zinc-900/50 p-3 rounded-xl overflow-hidden ' title='View enlarge' onClick={(prev)=>(setIsModalOpen(true))}><ZoomInIcon className='hover:text-rose-200  transition-all ease-in-out' /> </button>
                <div class="transition-all ease-in-out absolute bottom-15 right-16 w-[70px]  invisible group-hover:visible opacity-0 group-hover:opacity-100  duration-300 bg-zinc-900/50 text-white text-sm px-2 py-1 rounded">
                    Zoom In
                </div>
              </div>
              <div class="group mt-2">
                <button className='  bg-zinc-900/50 p-3 rounded-xl overflow-hidden ' title='View enlarge' onClick={(prev)=>(setIsModalOpen(true))}><Crosshair className='transition-all ease-in-out' /> </button>
                <div class="transition-all ease-in-out absolute bottom-0 right-18 w-[110px]  invisible group-hover:visible opacity-0 group-hover:opacity-100  duration-300 bg-zinc-900/50 text-white text-sm px-2 py-1 rounded">
                    Enlarge Image
                </div>
              </div>
              </div>
              
            </div>

            {/* small thumbs for mobile under the image */}
            
           {images?.length>1 && <div className="sm:hidden flex gap-3 mt-4 overflow-x-scroll  " >
              {images.slice(0, min(3,images.length)).map((src, i) => (
                <button key={i} onClick={() => setSelectedIndex(i)} className={`min-w-[68px] h-16 relative border rounded ${selectedIndex === i ? 'ring-2 ring-rose-800' : ''}`}>
                  <Image 
                    src={getImageUrl(src)} 
                    alt={`mthumb-${i}`} 
                    fill 
                    sizes="68px" 
                    className=" rounded"
                    unoptimized={true}
                     />
                </button>
              ))}
              {showViewMore && (
                <button onClick={() => setIsModalOpen(true)} className="min-w-[84px] h-16 flex items-center justify-center border rounded text-sm text-rose-800">
                  View more
                </button>
              )}
            </div>}
          </div>
          {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className=" w-full max-w-2xl bg-white rounded shadow-lg overflow-auto max-h-[80vh]">
            <div className=" relative flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">All Images</h3>
              <button onClick={() => setIsModalOpen(false)} className="fixed right-10 sm:right-[10%]  md:right-10 md:top-10 z-50 rounded-full  text-xl md:text-[72px]"><XCircle className='w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 stroke-2 bg-black/50 rounded-full md:stroke-1'/></button>
            </div>

            <div className="p-4 space-y-4">
              {images.map((src, i) => (
                <div key={i} className="w-full h-80 relative rounded overflow-hidden">
                  <Image 
                  src={getImageUrl(src)} 
                  alt={`modal-${i}`} 
                  fill 
                  sizes="100vw" 
                  className="object-contain"
                  unoptimized />
                </div>
              ))}
            </div>

            
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductImage
