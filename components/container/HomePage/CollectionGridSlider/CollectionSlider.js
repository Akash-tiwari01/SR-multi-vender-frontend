"use client"
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getImageUrl } from '@/utils/helperFunction';

const swiperConfig = {
  modules: [Navigation, Pagination],
  spaceBetween: 20,
  slidesPerView: 1.2,
  loop: true,
  navigation: true,
  pagination: { clickable: true },
  breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } },
};

/**
 * CollectionSlider Component.
 */
export default function CollectionSlider({ product_collections }) {
    return (

    <Swiper {...swiperConfig} className=' overflow-visible'>
    {product_collections.map((collection) => (
      <SwiperSlide key={collection.collection_id}>
        {/* Card used here is a simple div for simplicity within the slider context */}
        <div 
          className="p-6 my-4 h-64 rounded-xl shadow-md flex items-end relative overflow-hidden bg-cover bg-center transition-transform duration-300 hover:scale-[1.01]"
          style={{ backgroundImage: `url(${getImageUrl(collection.image)})` }}
        >
          <div className="relative z-10 p-2 bg-black/60 w-full rounded-md backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
  );
}