"use client"
import dynamic from 'next/dynamic';
import BannerSlide from './BannerSlide';

const SwiperContainer = dynamic(() => import('./SwiperWrapper'), {
  ssr: false,
  loading: ({ slides }) => <BannerPlaceholder slide={slides?.[0]} />
});

function BannerPlaceholder({ slide }) {
  return (
    <div className="w-full h-[450px] bg-gray-900 rounded-md my-2 shadow-md">
      {slide && <BannerSlide slide={slide} isPriority={true} />}
    </div>
  );
}

export default function Banner({ data }) {
  if (!data?.length) return null;

  return (
    <section className="w-full h-[450px] overflow-hidden bg-amber-950 rounded-md my-2 shadow-md">
      <SwiperContainer slides={data} />
    </section>
  );
}