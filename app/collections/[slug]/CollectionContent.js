// app/collections/[slug]/CollectionContent.js
import { getProductsCached } from '@/modules/collections/services/productService';
import FilterSidebar from '@/modules/collections/compoenets/FilterSlidebar';
import InfiniteProductList from '@/modules/collections/compoenets/InfiniteProductList';
import Link from 'next/link';
import Section from '@/components/container/genericContainer/Section'; // Assuming this is a basic wrapper

export default async function CollectionContent({ promiseParams, promiseFilters }) {
  // 1. Await dynamic data INSIDE the suspense boundary
  const { slug } = await promiseParams;
  const filters = await promiseFilters;

  // 2. Initial Fetch using the Service (Not Action)
  const initialData = await getProductsCached(slug, filters, 1);
  // console.log(initialData); // Keep the log for debugging if needed

  const collectionName = initialData?.product_collection?.name || 'Collection';

  return (
    <div className='  px-2 sm:px-2 lg:px-2 '>
      
      {/* --- 1. Breadcrumb and Header Section --- */}
      
      
      {/* --- 2. Interactive Grid Layout: Filters and Products --- */}
      
      {/* Responsive Grid Structure:
        - Mobile (default): Stacked (100% width for both)
        - Medium (md): Sidebar (approx 1/4 or 25%) and Main Content (3/4 or 75%)
        - Large (lg): Sidebar (fixed width or 1/5, approx 20%) and Main Content (4/5, approx 80%)
      */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 md:gap-2">
        
        {/* === Sidebar: Filters (1/4 or 1/5 width) === */}
        <div className="md:col-span-1 lg:col-span-1 mb-8 md:mb-0">
          <div className="md:sticky md:top-12 mt-2"> 
             {/* sticky makes the filter stay put when scrolling the product list */}
            <FilterSidebar slug={slug} currentFilters={filters} />
          </div>
        </div>
        
        {/* === Product List: Infinite Scroll (3/4 or 4/5 width) === */}
        <div className="md:col-span-3 lg:col-span-4">
          <Section >
          <nav className="text-sm font-medium text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700 transition">Home</Link> 
            <span className="mx-2">/</span> 
            <span className="text-gray-700 font-semibold">{collectionName}</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-gray-900">{collectionName}</h1>
          </Section>
          <InfiniteProductList 
            initialData={initialData} 
            slug={slug} 
            currentFilters={filters} 
          />
        </div>
        
      </div>
    </div>
  );
}