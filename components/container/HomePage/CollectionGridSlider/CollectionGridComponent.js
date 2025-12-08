"use client"
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getImageUrl } from '@/utils/helperFunction';
import CollectionSlider from '@/components/CollectionSlider';
import DynamicGrid from '@/components/DynamicGrid';

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
export default function CollectionGridComponent({ collections_component, title }) {
  const {product_collections} = collections_component
  if (product_collections?.length===0 || product_collections.length == undefined)
    return (
    <div>
        NO collection present...
    </div>
  );
  else if (product_collections?.length<6){
    return(
        <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">{title}</h2>
        <div className="py-4 rounded-xl ">
        <DynamicGrid product_collections={product_collections}/>
        </div>
        </section>
    )
    
  }
  else{
    return(
        <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{title}</h2>
        <div className="py-4 mx-4 rounded-xl ">
            <CollectionSlider product_collections    = {product_collections}/>
        </div>
        </section>
    )
  }
}