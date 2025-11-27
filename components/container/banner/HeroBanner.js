"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";


// ----------------Banner Image---------------

const banners = [
  "/banner/banner1.webp",
  "/banner/banner2.webp",
  "/banner/banner3.webp",
];



export default function HeroBanner() {
  return (
      <section className="relative w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          
          loop
          className="mySwiper"
        >
          {banners.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]">
                <Image
                  src={src}
                  alt={`Banner ${i + 1}`}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
  );
}
