"use client"
import React, { useState, useEffect } from 'react'
import {  ChevronsRight, Crosshair, Heart, XCircle, ZoomInIcon } from 'lucide-react';
import Image from 'next/image'
import {min, getImageUrl} from  '@/utils/helperFunction'
import ImageMagnifier from '@/components/ImageMagnifier';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlistItemRequest, selectIsInWishlist } from '@/redux/wishlist/wishlistSlice';
import { toast } from 'react-hot-toast';
import ProductViewModal from './ProductViewModal';



function ProductImage({isModalOpen, setIsModalOpen}) {

    const dispatch = useDispatch();
    const {currentProduct, selectedVariation, status} = useSelector((state)=>state.product);
    const isWishlisted = useSelector((state) => selectIsInWishlist(state, currentProduct?._id));
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isMagnifyEnabled, setIsMagnifyEnabled] = useState(true);

    const handleToggleWishlist = () => {
      if (currentProduct) {
        dispatch(toggleWishlistItemRequest(currentProduct));
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
      }
    };
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
          

          {/* Large image box */}
          <div className=" flex flex-col justify-center items-start w-full">
            <div className="relative  w-full   ">
              <ImageMagnifier src={getImageUrl(images[selectedIndex])} isEnabled={isMagnifyEnabled}/>
              <div className='absolute bottom-2 right-2'>
                <div className="group ">
                  <button 
                    onClick={handleToggleWishlist}
                    className={`bg-zinc-900/50 hover:bg-brand-primary ease-in-out p-3 rounded-full backdrop-blur-md transition-all active:scale-90 ${isWishlisted ? 'text-rose-500' : 'hover:text-brand-secondary text-white'}`}>
                    <Heart fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                  <div 
                    className="transition-all ease-in-out absolute bottom-16 lg:bottom-30 right-16 w-[120px] text-center  invisible group-hover:visible opacity-0 group-hover:opacity-100  duration-300 bg-zinc-900/50 text-white text-sm px-2 py-1 rounded">
                      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  </div>
                </div>
                <div className="hidden lg:block group mt-2 ">
                  <button 
                    className='bg-zinc-900/50 hover:bg-brand-primary ease-in-out hover:text-brand-secondary p-3 rounded-full backdrop-blur-md transition-all active:scale-90  ' 
                    title='View enlarge' 
                    onClick={()=>{setIsMagnifyEnabled(isMagnifyEnabled?false:true)}}
                  >
                    <ZoomInIcon className=' transition-all ease-in-out' /> 
                  </button>
                  <div className="transition-all ease-in-out absolute bottom-16 right-16 w-[120px] text-center  invisible group-hover:visible opacity-0 group-hover:opacity-100  duration-300 bg-zinc-900/50 text-white text-sm px-2 py-1 rounded">
                      Zoom In
                  </div>
                </div>
              <div className="group mt-2">
                <button 
                className='bg-zinc-900/50 hover:bg-brand-primary ease-in-out hover:text-brand-secondary p-3 rounded-full backdrop-blur-md transition-all active:scale-90  ' 
                title='View enlarge' 
                onClick={(prev)=>(setIsModalOpen(true))}
                >
                  <Crosshair className='transition-all ease-in-out' /> 
                </button>
                <div className="transition-all ease-in-out absolute bottom-2 right-16 w-[120px] text-center  invisible group-hover:visible opacity-0 group-hover:opacity-100  duration-300 bg-zinc-900/50 text-white text-sm px-2 py-1 rounded">
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
          
    </div>
  )
}

export default ProductImage
