"use client"
import React, { useState, useEffect } from 'react'
import {  ChevronsRight, Crosshair, XCircle, ZoomInIcon } from 'lucide-react';
import Image from 'next/image'
import {min, getImageUrl} from  '@/utils/helperFunction'
import ImageMagnifier from '@/components/ImageMagnifier';
import { useSelector } from 'react-redux';



function ProductImage() {

    const {currentProduct, selectedVariation, status} = useSelector((state)=>state.product);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isMagnifyEnabled, setIsMagnifyEnabled] = useState(true);
    const images = selectedVariation?.media?.length ? 
    [...selectedVariation.media, ...currentProduct?.media]
    : currentProduct?.media 
    ?? []
    const visibleThumbs = 4
    const showViewMore = images?.length > visibleThumbs

    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden'; // Lock background
      } else {
        document.body.style.overflow = 'unset'; // Unlock
      }
      return () => { document.body.style.overflow = 'unset'; }; // Safety cleanup
    }, [isModalOpen]);
    
    return (
    <div className=" flex gap-4 md:sticky top-0 lg:top-10  pl-0.5 pt-0.5 ">
          {/* thumbnails vertical */}
          {/* <div className="hidden  flex-col gap-4 w-20 items-center justify-center">
            {images.slice(0, min(5,images.length)).map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`w-full h-20 relative  rounded   ${selectedIndex === i ? 'ring-2 ring-brand-secondary' : ''}`}
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
                className="w-full h-0 bg-white  rounded flex items-center justify-center text-[9px]  text-brand-secondary font-medium hover:text-brand-secondary/80"
              >
                View more <ChevronsRight className='h-2.5'/>
              </button>
            )}
          </div> */}

          {/* Large image box */}
          <div className=" flex flex-col justify-center items-start w-full">
            <div className="relative  w-full   ">
              <ImageMagnifier src={getImageUrl(images[selectedIndex])} isEnabled={isMagnifyEnabled}/>
              <div className='absolute bottom-2 right-2'>
              <div className="group ">
                <button className='  bg-zinc-900/50 p-3 rounded-xl overflow-hidden ' title='View enlarge' onClick={()=>{setIsMagnifyEnabled(isMagnifyEnabled?false:true)}}><ZoomInIcon className='hover:text-rose-200  transition-all ease-in-out' /> </button>
                <div className="transition-all ease-in-out absolute bottom-15 right-16 w-[70px]  invisible group-hover:visible opacity-0 group-hover:opacity-100  duration-300 bg-zinc-900/50 text-white text-sm px-2 py-1 rounded">
                    Zoom In
                </div>
              </div>
              <div className="group mt-2">
                <button className='  bg-zinc-900/50 p-3 rounded-xl overflow-hidden ' title='View enlarge' onClick={(prev)=>(setIsModalOpen(true))}><Crosshair className='transition-all ease-in-out' /> </button>
                <div className="transition-all ease-in-out absolute bottom-0 right-18 w-[110px]  invisible group-hover:visible opacity-0 group-hover:opacity-100  duration-300 bg-zinc-900/50 text-white text-sm px-2 py-1 rounded">
                    Enlarge Image
                </div>
              </div>
              </div>
            </div>

            {/* small thumbs for mobile under the image */}
            
           {images?.length>1 && <div className=" flex gap-2 justify-center w-full mt-2" >
              {images.slice(0, min(3,images.length)).map((src, i) => (
                <button key={i} onClick={() => setSelectedIndex(i)} className={`min-w-[68px] h-16 relative rounded ${selectedIndex === i ? 'ring-2 ring-brand-secondary' : 'border'}`}>
                  <Image 
                    src={getImageUrl(src)} 
                    alt={`mthumb-${i}`} 
                    fill
                    className=" rounded object-contain"
                    unoptimized={true}

                     />
                </button>
              ))}
              {showViewMore && (
                <button onClick={() => setIsModalOpen(true)} className="min-w-[84px] h-16 flex items-center justify-center border rounded text-sm text-brand-secondary">
                  View more
                </button>
              )}
            </div>}
          </div>
          {isModalOpen && (
            /* 1. Backdrop: Pure fixed centering */
            <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
              
              {/* 2. Modal Card: Width and Height management */}
              <div className="relative w-full max-w-5xl h-[80vh] flex flex-col bg-white rounded-md overflow-hidden shadow-2xl md:mt-30">
                
                {/* 3. Header: Sticky to top of the modal card */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-2 py-1 bg-brand-primary border-b border-brand-primary/20">
                  <h3 className="text-lg font-bold text-brand-secondary">
                    Product Gallery ({images.length})
                  </h3>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
                  >
                    <XCircle className="w-8 h-8 text-brand-secondary" />
                  </button>
                </div>

                {/* 4. Content: Scrollable Gallery */}
                <div className="flex-1 overflow-y-auto  space-y-8 bg-gray-50 scrollbar-hide">
                  {images.map((src, i) => (
                    <div 
                      key={i} 
                      className="relative w-full h-[50vh] md:h-[75vh]  overflow-hidden "
                    >
                      <Image 
                        src={getImageUrl(src)} 
                        alt={`Full view ${i}`} 
                        fill 
                        sizes="(max-width: 1024px) 100vw, 80vw" 
                        className="object-contain p-4 md:p-8" 
                        unoptimized={true} 
                      />
                    </div>
                  ))}
                  
                  {/* Footer spacer */}
                  <div className="hover:bg-black text-center bg-brand-primary w-full py-2 text-brand-secondary text-xs font-bold tracking-widest uppercase" onClick={() => setIsModalOpen(false)}>
                    End of Gallery
                  </div>
                </div>
              </div>
            </div>
          )}
    </div>
  )
}

export default ProductImage
