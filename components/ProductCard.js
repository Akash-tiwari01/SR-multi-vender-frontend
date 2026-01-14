'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/utils/helperFunction';
import { cn } from '@/utils/cn';
import { addToCart } from '@/redux/cart/cartSlice';
import calculateDiscountPercentage from '@/utils/calculateDiscountPercentage';
import InfinityLoader from './InfinityLoader';
import ButtonPrimary from './ButtonPrimary';

function ProductCard({ product }) {
  console.log(product);
  const dispatch = useDispatch();
  
  const discount = calculateDiscountPercentage(
    product.regular_price,
    product.sale_price
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.in_stock || product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    dispatch(
      addToCart({
        product: product._id,
        variation: null,
        quantity: 1,
        productData: {
          slug: product.slug,
          name: product.name,
          image: product.media?.[0] || '',
          price: parseFloat(product.sale_price) || 0,
          regularPrice:
            parseFloat(product.regular_price) ||
            parseFloat(product.sale_price) ||
            0,
          vendor: product.vendor?._id || null,
          vendorName: product.vendor?.name || 'Unknown Vendor',
          stock: product.stock || 0,
        },
      })
    );
      console.log("Hurray!!!");
    toast.success(`${product.name} added to cart!`);
  };
  const item = product.is_variable_product && product.variation?.length>0 ?product.variations[0]:product;
  const outOfStock = !!(!product.in_stock || product.stock <= 0)
  return (
  <div className="group relative bg-white rounded-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full w-full">
      
    {/* 1. Image Section */}
    <div className="relative aspect-square overflow-hidden border-b border-gray-200">
      <Link href={`/products/${product?.slug}`}>
        {/* Main Image */}
          <Image
            src={getImageUrl(product?.media?.[0])}
            alt={product?.name || 'Product Image'}
            // Next.js Image optimization best practice (fill container)
            fill
            unoptimized
            className='object-contain w-full h-full transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0'
          />
          {item?.media?.[1] && (
            <Image
              src={getImageUrl(product?.media?.[1])}
              alt={product?.name || "Product Image Hover"}
              className="
                w-full 
                h-full 
                transition-opacity 
                duration-500 
                ease-in-out 
                opacity-0 
                group-hover:opacity-100 
                absolute 
                top-0 
                left-0
              "
              layout="fill"
              objectFit="cover"
              unoptimized={true}
            />
          )}
        </Link>

        {discount > 0 && (
            <div className="absolute -bottom-px right-0  z-20">
              <span className="bg-brand-accent text-brand-primary text-[9px] font-bold tracking-widest uppercase px-2.5 pt-1 pb-2  rounded-tl-sm shadow-sm">
                {discount}% OFF
              </span>
            </div>
          )}

        {/* Out of Stock Badge */}
        {outOfStock && (
          <div className='absolute inset-0 bg-black/50  flex items-center justify-center'>
            <span className='bg-gray-600/80 text-white px-4 py-2 w-full text-center  font-semibold'>
              Out of Stock
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
              ₹{item.sale_price}
            </span>
            {discount > 0 && (
            <span className="text-[.6rem] md:text-[.9rem] text-gray-400 line-through">
            ₹{item.regular_price}
          </span>
        )}
      </div>
      
        {/* --- Quick Action (Desktop Hover) --- */}
        <div className=" transition-transform duration-300 hidden md:block ">
        <ButtonPrimary
        disabled={outOfStock }
        onClick={handleAddToCart}
        >
          {
          false?(<div className="flex item h-5">
                <InfinityLoader/>
            </div>):outOfStock?'OUT OF STOCK':
            (<div className="flex items-center">
                <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" height="14"
            viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2.5" 
            strokeLinecap="round" strokeLinejoin="round" 
          >
            <path d="M5 12h14m-7-7v14"/>
          </svg> QUICK ADD
            </div>)
          }
        </ButtonPrimary>
        </div>

        {/* --- Mobile Only Button: Modern Gradient --- */}
          {/* Mobile Version: More space for touch */}
          <button 
          onClick={handleAddToCart}
          disabled={!product.in_stock || product.stock <= 0}
          className="md:hidden w-full bg-linear-to-r from-brand-secondary via-[#f2c977] to-brand-secondary text-brand-primary py-2.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center shadow-sm">
          {!product.in_stock || product.stock <= 0
            ? 'OUT OF STOCK'
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>} 
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
