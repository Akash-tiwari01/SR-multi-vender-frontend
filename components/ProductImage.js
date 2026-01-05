"use client"
import React, { useState, useEffect } from 'react'
import { ChevronsRight, Crosshair, XCircle, ZoomInIcon } from 'lucide-react';
import Image from 'next/image'
import { min, getImageUrl } from '../utils/helperFunction'
import ImageMagnifier from './ImageMagnifier';

function ProductImage({ images }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Body Scroll Lock logic
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function
        return () => { document.body.style.overflow = 'unset'; };
    }, [isModalOpen]);

    const visibleThumbs = 4
    const showViewMore = images.length > visibleThumbs

    return (
        <div className="h-fit lg:h-[80vh] col-span lg:col-span-6 flex flex-col sm:flex-row gap-6">
            {/* 1. Vertical Thumbnails (Desktop) */}
            <div className="hidden sm:flex flex-col gap-4 w-20 shrink-0">
                {images.slice(0, 5).map((src, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedIndex(i)}
                        className={`w-full h-20 relative rounded-lg overflow-hidden transition-all ${
                            selectedIndex === i ? 'ring-2 ring-brand-secondary shadow-lg' : 'opacity-70 hover:opacity-100'
                        }`}
                    >
                        <Image
                            src={getImageUrl(src)}
                            alt={`thumb-${i}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                        />
                    </button>
                ))}

                {showViewMore && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-2 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] text-brand-primary font-bold hover:bg-brand-secondary hover:text-white transition-all"
                    >
                        + {images.length - 5} MORE
                    </button>
                )}
            </div>

            {/* 2. Main Large Image Box */}
            <div className="relative grow rounded-xl overflow-hidden bg-white border border-gray-100">
                <ImageMagnifier src={getImageUrl(images[selectedIndex])} />
                
                {/* Floating Action Buttons */}
                <div className='absolute bottom-4 right-4 flex flex-col gap-2 z-10'>
                    <button 
                        className='bg-brand-primary/80 hover:bg-brand-primary text-white p-3 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-xl'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <ZoomInIcon className='w-5 h-5' />
                    </button>
                    <button 
                        className='bg-brand-primary/80 hover:bg-brand-primary text-white p-3 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-xl'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Crosshair className='w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* 3. Horizontal Thumbs (Mobile Only) */}
            {images?.length > 1 && (
                <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {images.map((src, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSelectedIndex(i)} 
                            className={`min-w-[70px] h-16 relative rounded-lg shrink-0 ${selectedIndex === i ? 'ring-2 ring-brand-secondary' : ''}`}
                        >
                            <Image 
                                src={getImageUrl(src)} 
                                alt={`mobile-thumb-${i}`} 
                                fill 
                                sizes="70px" 
                                className="object-cover rounded-lg"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* 4. Fullscreen Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-brand-primary/95 backdrop-blur-sm p-4 md:p-10">
                    {/* Close Button: Absolute to Screen */}
                    <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="absolute top-6 right-6 text-white hover:text-brand-secondary transition-colors z-10000"
                    >
                        <XCircle className='w-10 h-10 md:w-14 md:h-14 stroke-[1.5]' />
                    </button>

                    <div className="w-full max-w-5xl h-full overflow-y-auto no-scrollbar space-y-6 py-10">
                        {images.map((src, i) => (
                            <div key={i} className="relative w-full h-[60vh] md:h-[80vh]">
                                <Image 
                                    src={getImageUrl(src)} 
                                    alt={`full-${i}`} 
                                    fill 
                                    className="object-contain"
                                    unoptimized 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductImage