"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { ShoppingCart, ChevronsRight } from "lucide-react";
import { addToCartRequest } from "@/modules/products/state/productSlice";
import { formatPrice } from "@/utils/helperFunction";
import VariationSelector from "./VariationSelector";
import ProductSpecs from "./ProductSpecs";
import ButtonPrimary from "@/components/ButtonPrimary";
import { ButtonSecondary } from "@/components/ButtonSecondary";


export default function ProductInfo() {
  const { currentProduct, selectedVariation, status } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
    console.log('selectedVariation: ',selectedVariation, "currentProduct:",currentProduct);
  if (!currentProduct) return null;

  const price = selectedVariation?.sale_price ?? currentProduct.sale_price;
  const sku = selectedVariation?.sku ?? currentProduct.sku;

  return (
    <div className=" lg:col-span-6 px-4">
      
      {/* Title */}
      <h1 className="text-2xl lg:text-2xl font-bold text-brand-primary mb-2">
        {currentProduct.name || "Untitled Product"}
      </h1>

      {/* Vendor */}
      {(currentProduct.vendor?.name) && (
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-gray-600">Sold By:</span>
          <button className="text-sm font-semibold text-brand-secondary">
            {currentProduct.vendor.name}
          </button>
        </div>
      )}

      {/* Short Description */}
      <div className="">
        <p
          className=" text-sm font-semibold text-brand-primary leading-relaxed mt-0 mb-2"
          dangerouslySetInnerHTML={{ __html: currentProduct.description }}
        />
        {/* <button className="flex text-rose-800 group">
          Read more
          <ChevronsRight className="h-6 stroke-1 group-hover:ml-2 transition-all" />
        </button> */}
      </div>

      {/* Price */}
      <div className="text-3xl font-bold text-brand-secondary mb-2">
        {formatPrice(price)}
      </div>

      {/* Variations */}
      <VariationSelector />

      {/* Actions */}
      <div className="flex gap-4 mb-6 ">
        <ButtonPrimary
          onClick={() =>
            dispatch(
              addToCartRequest({
                product: currentProduct._id,
                variation: selectedVariation?._id,
              })
            )
          }
          disabled={status === "loading"}
          className=""
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" height="16" 
            viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="3.5" 
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M5 12h14m-7-7v14"/>
          </svg>
          {status === "loading" ? "Adding..." : "Add to Cart"}
        </ButtonPrimary>

        <ButtonSecondary className="">
          Buy Now
        </ButtonSecondary>

        <button className="w-1/6 h-12 border rounded flex items-center justify-center text-4xl">
          ♡
        </button>
      </div>

      {/* Trust Badges */}
      <div className="border-t">
        <div className="flex gap-10  flex-wrap justify-center ">
          
          {currentProduct?.cod_available && <div className="flex items-center gap-1 flex-col">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={'/icons/cash-on-delivery.png'}
                  alt="icon"
                  width={40}
                  height={40}
                />
              </div>
              <div className="text-sm font-medium capitalize text-center">
              COD Available
              </div>
          </div>}
          {<div className="flex items-center gap-1 flex-col">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={'/icons/authenticity.png'}
                  alt="icon"
                  width={40}
                  height={40}
                />
              </div>
              <div className="text-sm font-medium capitalize text-center">
              100% Authentic
              </div>
          </div>}
          {currentProduct?.return_available && <div className="flex items-center gap-1 flex-col">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={'/icons/return.png'}
                  alt="icon"
                  width={40}
                  height={40}
                />
              </div>
              <div className="text-sm font-medium capitalize text-center">
              7 days return
              </div>
          </div>}
          {currentProduct?.exchange_available && <div className="flex items-center gap-1 flex-col">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={'/icons/return.png'}
                  alt="icon"
                  width={40}
                  height={40}
                />
              </div>
              <div className="text-sm font-medium capitalize text-center">
              7 days replacement
              </div>
          </div>}
          <div className="flex items-center gap-1 flex-col">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={'/icons/makiinindia.png'}
                  alt="icon"
                  width={40}
                  height={40}
                />
              </div>
              <div className="text-sm font-medium capitalize text-center">
              Make In India
              </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-2 border-t">
      <ProductSpecs specifications={currentProduct.specifications} />
        
      </div>
    </div>
  );
}
