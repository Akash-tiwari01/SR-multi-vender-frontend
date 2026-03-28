'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSearch() {
      if (!q) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/api/search?q=${encodeURIComponent(q)}`);
        setData(res.data);
      } catch (error) {
        console.error("Search fetch error", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSearch();
  }, [q]);

  if (isLoading) {
    return (
      <div className="flex bg-white flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-primary mb-4" size={40} />
        <p className="text-gray-500 font-medium">Searching for &quot;{q}&quot;...</p>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="flex bg-white flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-800">Search</h1>
        <p className="text-gray-500 mt-2">Please enter a search term.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex bg-white flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-800">Error</h1>
        <p className="text-gray-500 mt-2">Failed to load search results.</p>
      </div>
    );
  }

  const { isFallback, data: searchData, message } = data;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh] bg-slate-50">
      
      {/* Search Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-brand-primary">
          Search Results for &quot;{q}&quot;
        </h1>
        {isFallback && (
          <p className="mt-3 text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {message || "We couldn't find exact matches for your search. Check out these popular items instead!"}
          </p>
        )}
      </div>

      {isFallback ? (
        // Fallback Products Grid
        <div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.isArray(searchData) && searchData.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Categories */}
          {searchData?.categories?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-brand-primary w-2 h-6 mr-2 rounded"></span>
                Matching Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchData.categories.map((cat) => (
                  <div key={cat._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-brand-primary">{cat.name}</h3>
                      <Link href={`/category/${cat.slug}`} className="text-sm font-semibold text-brand-secondary flex items-center hover:underline">
                        View All <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                       {cat.products?.map((prod) => (
                         <Link key={prod._id} href={`/products/${prod.slug}`} className="flex-shrink-0 w-20 group">
                           <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative mb-1">
                              <img src={prod.media?.[0]} alt={prod.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                           </div>
                           <p className="text-[10px] font-medium truncate text-gray-700">{prod.name}</p>
                           <p className="text-[10px] font-bold text-brand-primary">₹{prod.sale_price}</p>
                         </Link>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Collections */}
          {searchData?.collections?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-brand-secondary w-2 h-6 mr-2 rounded"></span>
                Matching Collections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchData.collections.map((col) => (
                  <div key={col._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-brand-primary">{col.name}</h3>
                      <Link href={`/collections/${col.slug}`} className="text-sm font-semibold text-brand-secondary flex items-center hover:underline">
                        View All <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                       {col.products?.map((prod) => (
                         <Link key={prod._id} href={`/products/${prod.slug}`} className="flex-shrink-0 w-20 group">
                           <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative mb-1">
                              <img src={prod.media?.[0]} alt={prod.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                           </div>
                           <p className="text-[10px] font-medium truncate text-gray-700">{prod.name}</p>
                           <p className="text-[10px] font-bold text-brand-primary">₹{prod.sale_price}</p>
                         </Link>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Standalone Products */}
          {searchData?.products?.length > 0 && (
            <section>
               <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-gray-800 w-2 h-6 mr-2 rounded"></span>
                Product Hits
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchData.products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex bg-white flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-primary mb-4" size={40} />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
