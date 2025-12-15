"use client";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProductData} from '@/modules/products/state/productSlice'
import ProductImage from './components/ProductImageClient'; // Your provided component
import ProductInfo from './components/ProductInfo';
import Section from '@/components/container/genericContainer/Section';

export default function ProductDetailsWrapper({ product }) {
  const dispatch = useDispatch();

  // Hydrate Redux Store on Mount
  useEffect(() => {
    if (product) {
      dispatch(setProductData(product));
    }
  }, [product, dispatch]);

  if (!product) return null;

  // Determine which images to show (Variation specific or General)
  // We'll read from Redux in the child components, but for initial load use props
  // For simplicity, passing base images here, but ProductImage could connect to Redux too.
  const displayImages = product.media || [];

  return (
    <Section className=" ">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-6">
           <ProductImage images={displayImages} />
        </div>

        {/* Right: Info & Cart */}
        <div className="lg:col-span-6">
           <ProductInfo />
        </div>
      </div>

      {/* Bottom: Specifications */}
    </Section>
  );
}