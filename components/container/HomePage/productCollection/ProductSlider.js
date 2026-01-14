import React from 'react';
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-brand-primary font-medium tracking-wide">
          No products found in this collection.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full py-6">
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product._id} className="flex">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}