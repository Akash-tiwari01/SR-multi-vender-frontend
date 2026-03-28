// app/collections/[slug]/CollectionContent.js
import { getProductsCached } from '@/modules/categorys/services/productService';
import FilterSidebar from '@/modules/categorys/compoenets/FilterSlidebar';
import InfiniteProductList from '@/modules/categorys/compoenets/InfiniteProductList';
import Link from 'next/link';
import Section from '@/components/container/genericContainer/Section';

export default async function CategoryContent({ promiseParams, promiseFilters }) {
  // 1. Await dynamic data INSIDE the suspense boundary
  const { slug } = await promiseParams;
  const filters = await promiseFilters;

  // 2. Initial Fetch using the Service (Not Action)
  const initialData = await getProductsCached(slug, filters, 1);
  // console.log(initialData); // Keep the log for debugging if needed

  const categoryName = initialData?.product_category?.name || 'Category';

  return (
    <div className='px-4 md:px-8 py-4 bg-slate-50/50 min-h-screen'>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {/* === Sidebar: Filters (1/4 or 1/5 width) === */}
        <div className="md:col-span-1">
          <div className="sticky top-20 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <FilterSidebar slug={slug} currentFilters={filters} />
          </div>
        </div>

        {/* === Product List: Infinite Scroll (3/4 or 4/5 width) === */}
        <div className="md:col-span-3 lg:col-span-4">
          <Section className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <nav className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
                <Link href="/" className="hover:text-brand-primary transition">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-brand-primary">{categoryName}</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{categoryName}</h1>
            </div>
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