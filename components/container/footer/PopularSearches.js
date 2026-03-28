import Link from 'next/link';
import { Search } from 'lucide-react';
import { fetchPopularSearches } from '@/lib/action.js';
import Image from 'next/image';

export default async function PopularSearches({ items=[] }) {

  const data = await fetchPopularSearches();
  const popularProducts = data?.products || [];

  if ((!items || items.length === 0) && popularProducts.length === 0) return null;
       
  return (
    <div className="bg-brand-primary border-t border-white/5">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-secondary/10 rounded-lg">
            <Search className="w-4 h-4 text-brand-secondary" />
          </div>
          <h2 className="text-xs font-black text-brand-secondary uppercase tracking-[0.2em]">
            Trending Discoveries
          </h2>
        </div>

        {/* Tag Container */}
        {items && items.length > 0 && (
          <div className="flex flex-wrap gap-2 md:gap-3 items-center mb-8">
            {items.map((item, index) => {
              const content = (
                <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs font-bold text-white/80 hover:text-brand-secondary hover:border-brand-secondary/50 hover:bg-brand-secondary/5 transition-all duration-300 cursor-pointer whitespace-nowrap uppercase tracking-wider">
                  {item.label}
                </span>
              );

              return (
                <div key={item.id || index} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                  {item.url ? (
                    <Link href={item.url} className="no-underline">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Popular Products Grid */}
        {popularProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularProducts.map((prod, index) => (
              <Link 
                key={prod._id} 
                href={`/products/${prod.slug}`} 
                className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors group animate-in fade-in zoom-in-95 duration-500"
                style={{ animationDelay: `${(items.length + index) * 50}ms` }}
              >
                <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-3 bg-white/10">
                  {prod.media && prod.media[0] ? (
                    <Image 
                      src={prod.media[0]} 
                      alt={prod.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Search size={24} />
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-bold line-clamp-1">{prod.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-brand-secondary text-sm font-black">₹{prod.sale_price}</p>
                  {prod.price > prod.sale_price && (
                    <p className="text-white/40 text-[10px] line-through">₹{prod.price}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}