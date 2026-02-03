"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Share2, Heart, Zap } from "lucide-react";

import { getImageUrl } from "@/utils/helperFunction";
import { addToCart } from "@/redux/cart/cartSlice";
import calculateDiscountPercentage from "@/utils/calculateDiscountPercentage";
import ReviewStars from "@/modules/Reviews/Components/ReviewStars";

const SLIDE_DURATION = 3000;

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const images = product?.media?.length > 0 ? product.media : ["/placeholder.png"];
  const outOfStock = !product?.in_stock || product?.stock <= 0;
  const discount = calculateDiscountPercentage(product?.regular_price, product?.sale_price);

  // --- Slider Logic ---
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const startSlider = () => {
    stopSlider();
    if (!outOfStock && images.length > 1) {
      timerRef.current = setInterval(nextSlide, SLIDE_DURATION);
    }
  };

  const stopSlider = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    isHovered ? stopSlider() : startSlider();
    return () => stopSlider();
  }, [isHovered, images.length]);

  // --- Action Handlers ---
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch (err) { console.error("Share failed", err); }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (outOfStock) return toast.error("Out of stock");
    
    dispatch(addToCart({
      product: product._id,
      quantity: 1,
      productData: { ...product, image: images[0] }
    }));
    toast.success("Added to cart");
  };

  return (
    <div 
      className="group relative flex flex-col h-full w-full overflow-hidden rounded-md bg-white border border-slate-100 transition-all duration-500 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Section: Image & Overlay Actions */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <Link href={`/products/${product?.slug}`} className="block h-full w-full">
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={getImageUrl(img)}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ease-in-out ${
                idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
              unoptimized
            />
          ))}
        </Link>

        {/* TOP FLOATING ACTIONS - Hidden until hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-30 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <button onClick={handleShare} title="Share" className="p-2.5 bg-white rounded-full shadow-lg text-brand-primary hover:bg-brand-primary hover:text-white transition-colors">
            <Share2 size={16} />
          </button>
          <button title="Add to Wishlist" className="p-2.5 bg-white rounded-full shadow-lg text-brand-primary hover:text-rose-500 transition-colors">
            <Heart size={16} />
          </button>
          <button onClick={handleAddToCart} title="Quick Add" className="p-2.5 bg-white rounded-full shadow-lg text-brand-primary hover:bg-brand-accent hover:text-brand-primary transition-colors">
            <ShoppingCart size={16} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {images.length > 1 && images.map((_, idx) => (
            <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentIndex ? "w-4 bg-brand-secondary" : "w-1 bg-white/50"}`} />
          ))}
        </div>
        
        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-brand-accent px-2 py-1 text-[10px] font-bold text-brand-primary rounded-md shadow-sm z-10">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex grow flex-col p-4 bg-white">
        <div className="mb-2">
          <p className="text-[9px] font-bold uppercase tracking-[2px] text-slate-400">
            Sold By: {product?.vendor?.name || "Unknown"}
          </p>
          <Link href={`/products/${product?.slug}`}>
            <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-brand-primary group-hover:text-brand-secondary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* INTEGRATED REVIEW STARS */}
        <div className="mb-2">
          <ReviewStars 
            rating={product?.averageRating || 0} 
            size={14} 
            showLabel={true} 
          />
        </div>

        <div className=" flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-primary">₹{product.sale_price}</span>
          {discount > 0 && (
            <span className="text-xs text-slate-400 line-through">₹{product.regular_price}</span>
          )}
        </div>

        {/* DUAL CTA BUTTONS */}
        <div className="mt-auto pt-2">
          {outOfStock ? (
            <button
              disabled
              className="w-full rounded-lg bg-slate-200 py-2.5 text-[11px] font-bold uppercase text-slate-500"
            >
              OUT OF STOCK
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center rounded-lg border-2 border-brand-primary py-2 text-[11px] font-bold text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
              >
                ADD TO CART
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-secondary py-2 text-[11px] font-bold text-brand-primary transition-all hover:brightness-110 active:scale-95 shadow-sm"
              >
                <Zap size={14} fill="currentColor" />
                BUY NOW
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;