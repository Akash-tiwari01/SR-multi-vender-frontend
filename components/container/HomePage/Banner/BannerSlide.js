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
        <div >
            <div className="flex md:hidden">
              <video
                src={getImageUrl(slide?.imageMobile)}
                autoPlay
                muted
                loop
                playsInline
                /* object-cover + inset-0 ensures it fills the aspect-ratio box */
                className="absolute inset-0 w-full h-full object-fill transition-transform duration-700 "
                poster="/images/banner-placeholder.jpg"
              />
          </div>
          <div className="hidden md:flex lg:hidden">
              <video
                src={getImageUrl(slide?.imageTablet)}
                autoPlay
                muted
                loop
                playsInline
                /* object-cover + inset-0 ensures it fills the aspect-ratio box */
                className="absolute inset-0 w-full h-full object-fill transition-transform duration-700 "
                poster="/images/banner-placeholder.jpg"
              />
          </div>
          <div className="hidden lg:flex">
              <video
                src={getImageUrl(slide?.image)}
                autoPlay
                muted
                loop
                playsInline
                /* object-cover + inset-0 ensures it fills the aspect-ratio box */
                className="absolute inset-0 w-full h-full object-fill transition-transform duration-700"
                poster="/images/banner-placeholder.jpg"
              />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex md:hidden">
          <Image
          src={getImageUrl(slide?.imageMobile)}
          alt={slide.title || "Promotion Banner"}
          fill
          priority={isPriority}
          /* object-cover maintains visual consistency without stretching */
          className="object-contain transition-transform duration-700 "
          sizes="100vw"
          quality={90} // 100 is often overkill; 90 saves bandwidth with no visible loss
          unoptimized 
        />
        </div>
        <div className="hidden md:flex lg:hidden">
          <Image
          src={getImageUrl(slide?.imageTablet)}
          alt={slide.title || "Promotion Banner"}
          fill
          priority={isPriority}
          /* object-cover maintains visual consistency without stretching */
          className="object-contain transition-transform duration-700 "
          sizes="100vw"
          quality={90} // 100 is often overkill; 90 saves bandwidth with no visible loss
          unoptimized 
        />
        </div>
        <div className="hidden lg:flex">
          <Image
          src={getImageUrl(slide?.image)}
          alt={slide.title || "Promotion Banner"}
          fill
          priority={isPriority}
          /* object-cover maintains visual consistency without stretching */
          className="object-contain transition-transform duration-700 "
          sizes="100vw"
          quality={90} // 100 is often overkill; 90 saves bandwidth with no visible loss
          unoptimized 
        />
        </div>
        </div>
      )}

      {/* Optional: Overlay Gradient for Text Readability if you add titles later */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </Link>
  );
}