"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function ImageMagnifier({
  src,
  zoomLevel = 2.5,
  lensSize = 120,
}) {
  const imgRef = useRef(null);

  const [lensPos, setLensPos] = useState({ x: -9999, y: -9999 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  // Next/Image `onLoad` gives event.target.naturalWidth/Height
  const onImageLoad = useCallback((e) => {
    const rect = imgRef.current.getBoundingClientRect();
    setImgSize({ width: rect.width, height: rect.height });
  }, []);

  const moveLens = (e) => {
    if (!imgSize.width) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Hide lens outside
    if (x < 0 || y < 0 || x > imgSize.width || y > imgSize.height) {
      setLensPos({ x: -9999, y: -9999 });
      return;
    }

    setLensPos({ x, y });
  };

  return (
    <div
      className="relative w-full h-[80vh]" // container height required for next/image fill
      onMouseMove={moveLens}
      onMouseLeave={() => setLensPos({ x: -9999, y: -9999 })}
    >
      <Image
        ref={imgRef}
        src={src}
        alt="product"
        fill
        className="object-cover rounded-md"
        onLoad={onImageLoad}
        unoptimized
      />

      <div
        className="absolute pointer-events-none rounded-full border border-gray-300"
        style={{
          width: lensSize,
          height: lensSize,
          left: lensPos.x - lensSize / 2,
          top: lensPos.y - lensSize / 2,
            zIndex:200,
          /* 👇 USE imgSize */
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
          backgroundPosition: `-${lensPos.x * zoomLevel - lensSize / 2}px -${
            lensPos.y * zoomLevel - lensSize / 2
          }px`,
        }}
      />
    </div>
  );
}
