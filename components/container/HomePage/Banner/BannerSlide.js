import { getImageUrl } from "@/utils/helperFunction";
import Image from "next/image";
import Link from "next/link";

export default function BannerSlide({ slide, isPriority }) {
  return (
    <Link href={slide.link} className=" w-full h-full">
      <Image
        src={getImageUrl(slide.image)}
        alt="Promotion Banner"
        height={450}
        width={100}
        priority={isPriority} // Prevents LCP delay
        className=""
        sizes="100vw"
        quality={85}
        unoptimized
      />
    </Link>
  );
}