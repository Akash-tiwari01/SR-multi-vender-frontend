"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "@/components/ProductCard";

export default function ProductSlider({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products available.
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay, Navigation]}
      spaceBetween={20}
      slidesPerView={5}
      autoplay={{ delay: 4000 }}
      loop={products.length > 5}
      breakpoints={{
        640: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 5, spaceBetween: 25 },
        1024: { slidesPerView: 5, spaceBetween: 30 },
      }}
      className="mySwiper product-slider"
    >
      {products.map((product) => (
        <SwiperSlide key={product._id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
