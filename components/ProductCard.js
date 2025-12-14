import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from '@/utils/helperFunction'; 
import { cn } from '@/utils/cn'; // Utility import karein

function ProductCard({ product }) {

  // --- Helper function for price calculations ---
  const calculateDiscountPercentage = (regularPrice, salePrice) => {
    if (regularPrice > 0 && salePrice < regularPrice) {
      const discount = regularPrice - salePrice;
      return Math.round((discount / regularPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscountPercentage(product.regular_price, product.sale_price);

  return (
    <div className="group relative bg-white rounded-xl hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full w-full">
      
      {/* 1. Image Section */}
      <div className="relative aspect-square overflow-hidden border-b border-gray-200">
        <Link href={`/products/${product._id}`}>
          {/* Main Image */}
          <Image
            src={getImageUrl(product?.media?.[0])}
            alt={product?.name || "Product Image"} // Use product name for better alt text
            className="
              w-full 
              h-full 
              transition-opacity 
              duration-500 
              ease-in-out
              opacity-100 
              group-hover:opacity-0
            "
            // Next.js Image optimization best practice (fill container)
            fill
            unoptimized
            className="object-contain w-full h-full transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
          />

          {/* Hover Image */}
          {product?.media?.[1] && (
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
          <div className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* 2. Details Section */}
      <div className="p-4 flex flex-col grow">
        <Link href={`/products/${product._id}`} className='grow'>
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-800 leading-snug hover:text-rose-600 transition-colors duration-200 mb-2">
            {product?.name || 'Product Name Missing'}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-2 mt-auto">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.sale_price}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-500 line-through">
              ₹{product.regular_price}
            </span>
          )}
        </div>
        
        <button className="mt-4 w-full py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-rose-600 transition-colors duration-200 shadow-md hover:shadow-lg">
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default ProductCard;