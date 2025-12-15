import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {getProductBySlug} from '@/modules/products/services/productServices'
import ProductDetailsWrapper from './ProductDetailsWrapper';
import ProductSkeleton from '@/components/Skeletons';
import RelatedProducts from './components/RelatedProducts';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.meta_title || product.name,
    description: product.meta_description,
    openGraph: {
      images: [product.mainImage], // Simplified for example
    },
  };
}

/**
 * Logic Component to handle data fetching for the main product
 * Supports Single Responsibility: Fetching & Validation
 */
async function ProductContent({ slug }) {
  const { product, relatedProducts } = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="min-h-screen text-slate-900 ">
      <ProductDetailsWrapper product={product} />
      
      <div className=" mx-auto   border-slate-100">
          <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  // FIX: Added the missing 'return' statement
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent slug={slug} />
    </Suspense>
  );
}