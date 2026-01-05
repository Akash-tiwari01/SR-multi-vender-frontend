import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from '@/utils/helperFunction';
import ButtonPrimary from './ButtonPrimary';
import AddToCartButton from './container/header/cart/AddToCartButton';


const ProductCard = ({ product }) => {
  const item = product.is_variable_product?product.variations[0]:product;
  console.log(item);
  const discount = Math.round(((item?.regular_price - item?.sale_price) / item?.regular_price) * 100);
  return (
    <div className="group relative flex flex-col w-full h-full bg-white  transition-all duration-500 overflow-hidden border border-gray-100/50">
      {/* --- Image Section --- */}
      <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
        <Link href={`/products/${item?.slug}`} className="block h-full w-full">
          <Image
            src={getImageUrl(item?.media?.[0])}
            alt={product?.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={true}
          />
          {item?.media?.[1] && (
            <Image
              src={getImageUrl(item?.media?.[1])}
              alt={`${product?.name} hover`}
              fill
              className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized={true}
            />
          )}
        </Link>
        {/* --- Badge: Modern Minimalist --- */}
        {discount > 0 && (
            <div className="absolute -bottom-px right-0  z-20">
              <span className="bg-brand-accent text-brand-primary text-[9px] font-bold tracking-widest uppercase px-2.5 pt-1 pb-2  rounded-tl-sm shadow-sm">
                {discount}% OFF
              </span>
            </div>
          )}
      </div>

      {/* --- Content Section --- */}
      <div className="p-0 pt-1 flex flex-col grow bg-white relative">
        
        <div className="grow">
          <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-medium">Sold By: {product?.vendor?.name}</p>
          <Link href={`/products/${product?.slug}`}>
            <h3 className="text-brand-primary font-medium text-sm md:text-base line-clamp-1 group-hover:text-brand-secondary transition-colors duration-300">
              {product?.name}
            </h3>
          </Link>
        </div>

        <div className="mt-1 flex items-baseline gap-0 flex-col md:flex-row md:gap-2">
          <span className="text-[.8rem] md:text-[1.1rem] font-bold text-brand-primary">
            ₹{item.sale_price.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-[.6rem] md:text-[.9rem] text-gray-400 line-through">
              ₹{item.regular_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* --- Quick Action (Desktop Hover) --- */}
        <div className=" transition-transform duration-300 hidden md:block ">
        <AddToCartButton productId={product._id}>QUICK ADD</AddToCartButton>
        </div>

        {/* --- Mobile Only Button: Modern Gradient --- */}
          {/* Mobile Version: More space for touch */}
          <button className="md:hidden w-full bg-linear-to-r from-brand-secondary via-[#f2c977] to-brand-secondary text-brand-primary py-2.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
      </div>
    </div>
  );
};

export default ProductCard;