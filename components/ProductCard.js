"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

import { getImageUrl } from "@/utils/helperFunction";
import { cn } from "@/utils/cn";
import { addToCart } from "@/redux/cart/cartSlice";
import calculateDiscountPercentage from "@/utils/calculateDiscountPercentage";

import ButtonPrimary from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import ReviewStars from "@/app/products/[slug]/components/ReviewStars";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const discount = calculateDiscountPercentage(
    product?.regular_price,
    product?.sale_price
  );

  const outOfStock = !product?.in_stock || product?.stock <= 0;

  const item =
    product?.is_variable_product && product?.variations?.length > 0
      ? product.variations[0]
      : product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) {
      toast.error("This product is out of stock");
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
          image: product.media?.[0] || "",
          price: Number(product.sale_price) || 0,
          regularPrice:
            Number(product.regular_price) ||
            Number(product.sale_price) ||
            0,
          vendor: product.vendor?._id || null,
          vendorName: product.vendor?.name || "Unknown Vendor",
          stock: product.stock || 0,
        },
      })
    );

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group relative bg-white rounded-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full w-full">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden border-b border-gray-200">
        <Link
          href={`/products/${product?.slug}`}
          className="relative block w-full h-full group"
        >
          {/* Base Image */}
          <Image
            src={getImageUrl(product?.media?.[0])}
            alt={product?.name || "Product Image"}
            fill
            unoptimized
            className="object-contain w-full h-full transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
            sizes="(min-width: 768px) 25vw, 50vw"
          />

          {/* Hover Image */}
          {product?.media?.[1] && (
            <Image
              src={getImageUrl(product?.media?.[1])}
              alt={product?.name || "Product Image Hover"}
              fill
              unoptimized
              className="object-contain w-full h-full absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          )}
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute right-0 bottom-0 z-20">
            <span className="bg-brand-accent text-brand-primary text-[9px] font-bold tracking-widest uppercase px-2.5 pt-1 pb-2 rounded-tl-sm shadow-sm">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <span className="bg-gray-600/80 text-white px-4 py-2 w-full text-center font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-2 pt-1 flex flex-col grow bg-white">
        <div className="grow">
          <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-medium">
            Sold By: {product?.vendor?.name}
          </p>

          <Link href={`/products/${product?.slug}`}>
            <h3 className="text-brand-primary font-medium text-sm md:text-base line-clamp-1 group-hover:text-brand-secondary transition-colors duration-300">
              {product?.name}
            </h3>
          </Link>
        </div>

        <div className="mt-1">
          <ReviewStars rating={4.5} size={15} />

          <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 mt-1">
            <span className="text-[.8rem] md:text-[1.1rem] font-bold text-brand-primary">
              ₹{item?.sale_price}
            </span>

            {discount > 0 && (
              <span className="text-[.6rem] md:text-[.9rem] text-gray-400 line-through">
                ₹{item?.regular_price}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:block mt-2">
          <ButtonPrimary disabled={outOfStock} onClick={handleAddToCart}>
            {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </ButtonPrimary>

          <ButtonSecondary
            disabled={outOfStock}
            onClick={handleAddToCart}
            className="mt-2"
          >
            {outOfStock ? "OUT OF STOCK" : "BUY NOW"}
          </ButtonSecondary>
        </div>

        {/* Mobile Action */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="md:hidden mt-3 w-full bg-linear-to-r from-brand-secondary via-[#f2c977] to-brand-secondary text-brand-primary py-2.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center shadow-sm"
        >
          {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
