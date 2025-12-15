"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function ImageMagnifier({
  src,
  zoomLevel = 2.5,
  lensSize = 120,
}) {
  const containerRef = useRef(null);

  const [lensPos, setLensPos] = useState(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  // Runs once image is fully loaded
  const handleImageReady = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setImgSize({ width: rect.width, height: rect.height });
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imgSize.width) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Outside image → hide lens
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLensPos(null);
      return;
    }

    setLensPos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[80vh] hidden md:block overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLensPos(null)}
    >
      {/* Base image */}
      <Image
        src={src}
        alt="Product image"
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-contain rounded-md"
        onLoadingComplete={handleImageReady}
        unoptimized
      />

      {/* Magnifier lens */}
      {lensPos && (
        <div
          className="absolute pointer-events-none rounded-full border border-gray-300 shadow-md"
          style={{
            width: lensSize,
            height: lensSize,
            left: lensPos.x - lensSize / 2,
            top: lensPos.y - lensSize / 2,
            zIndex: 30,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgSize.width * zoomLevel}px ${
              imgSize.height * zoomLevel
            }px`,
            backgroundPosition: `-${
              lensPos.x * zoomLevel - lensSize / 2
            }px -${lensPos.y * zoomLevel - lensSize / 2}px`,
          }}
        />
      )}
    </div>
  );
}
