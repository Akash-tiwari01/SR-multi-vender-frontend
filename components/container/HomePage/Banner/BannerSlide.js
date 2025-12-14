import { getImageUrl } from "@/utils/helperFunction";
import Image from "next/image";
import Link from "next/link";

export default function BannerSlide({ slide, isPriority }) {
  return (
    <Link href={slide.link} className="block relative w-full h-full bg-amber-950">
      <Image
        src={getImageUrl(slide.image)}
        alt="Promotion Banner"
        fill
        priority={isPriority} // Prevents LCP delay
        className=""
        sizes="100vw"
        quality={85}
        unoptimized
      />
    </Link>
  );
}