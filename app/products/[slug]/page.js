// src/app/products/[slug]/page.jsx (Route Segment)

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
// Assuming the skeleton component path is correct
import ProductSkeleton from '@/components/Skeletons'; 
// Assuming the services and component imports are correct
import { getProductBySlug } from '@/modules/products/services/productServices'; 
import ProductDetailsWrapper from './ProductDetailsWrapper';
import RelatedProducts from './components/RelatedProducts';


/**
 * 1. 🌐 generateMetadata (Server Function)
 * This must be an async function that returns a plain metadata object directly. 
 * We adhere to SRP by consolidating metadata logic here, removing DynamicMetaData.
 *
 * NOTE: Added 'await' on params for future-proofing as requested.
 */
export async function generateMetadata({ params }) {
  // Anticipating params might be a Promise in future versions (Next.js 16)
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  try {
    // Data fetching logic (Next.js dedupes this call)
    const { product } = await getProductBySlug(slug);

    if (!product) return { title: 'Product Not Found' };

    // Return the metadata object
    return {
      title: product.meta_title || product.name || 'Product Details',
      description: product.meta_description || product.name,
      // Simplified image handling for OpenGraph
      openGraph: {
        images: [product.media?.[0] || product.mainImage || ''], 
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { title: 'Store Product Page' };
  }
}

/**
 * 2. 🧱 ProductContent (Server Component)
 * Handles data fetching and initial composition.
 *
 * SOLID Principle: Single Responsibility Principle (SRP)
 * Only responsible for fetching the main product data and rendering its layout.
 */
async function ProductContent({promiseParams}) {
  const {slug} = await promiseParams;
  const { product, relatedProducts } = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="min-h-screen text-slate-900 ">
      {/* Product Details Wrapper (likely a Client Component consuming Server Data) */}
      <ProductDetailsWrapper product={product} /> 
      
      {/* Related Products Section */}
      <div className="mx-auto border-t border-slate-100 mt-8 pt-8">
        <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}

/**
 * 3. 🏁 ProductPage (Main Export - Server Component)
 * Defines the route segment and the loading boundary.
 *
 * SOLID Principle: Interface Segregation Principle (ISP)
 * Minimal interface, handling only parameters and orchestration.
 */
export default async function ProductPage({ params }) {
  // Anticipating params might be a Promise in future versions (Next.js 16)
 

  // The 'return' statement is crucial here to render the component tree
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent promiseParams={params} />
    </Suspense>
  );
}