import { getImageUrl } from "@/utils/helperFunction";
import { isVideo } from "@/utils/mediaHelper";
import Image from "next/image";
import Link from "next/link";

export default function BannerSlide({ slide, isPriority }) {
  const mediaUrl = getImageUrl(slide.image);
  const isVideoAsset = isVideo(slide.image);

  return (
    <Link 
      href={slide.link} 
      /* 'aspect-[16/9]' (or 21/9) ensures the height scales perfectly with width.
         'md:aspect-[21/9]' allows you to make it wider on desktop.
      */
      className="group relative block w-full overflow-hidden h-full  bg-gray-100"
      aria-label={slide.title || "Promotion Banner"}
    >
      {isVideoAsset ? (
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          /* object-cover + inset-0 ensures it fills the aspect-ratio box */
          className="absolute inset-0 w-full h-full object-fill transition-transform duration-700 "
          poster="/images/banner-placeholder.jpg"
        />
      ) : (
        <Image
          src={mediaUrl}
          alt={slide.title || "Promotion Banner"}
          fill
          priority={isPriority}
          /* object-cover maintains visual consistency without stretching */
          className="object-contain transition-transform duration-700 "
          sizes="100vw"
          quality={90} // 100 is often overkill; 90 saves bandwidth with no visible loss
          unoptimized 
        />
      )}

      {/* Optional: Overlay Gradient for Text Readability if you add titles later */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </Link>
  );
}