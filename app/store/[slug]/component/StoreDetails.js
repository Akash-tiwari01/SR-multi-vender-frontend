import Image from "next/image";
import { notFound } from "next/navigation";
import ProductList from "./ProductList";
import { getImageUrl } from "@/utils/helperFunction";
import Section from "@/components/container/genericContainer/Section";

async function getStoreData(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5058/api";
  
  // 'no-store' or 'revalidate' is fine here because it's inside Suspense
  const res = await fetch(`${baseUrl}/vendors/store/${slug}?page=1&limit=8`, {
    next: { revalidate: 3600 } 
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function StoreDetails({ paramsPromise }) {
  // Await the params here, inside the Suspense boundary
  const { slug } = await paramsPromise;

  if (!slug) notFound();

  const data = await getStoreData(slug);
  if (!data || !data.success) notFound();

  const { vendor_detail, products, pagination } = data;
  const { vendor } = vendor_detail;

  return (
    <div className="">
       {/* ... Your existing Store Detail UI code ... */}
       <Section>
       <div className="flex  items-center justify-between gap-8 text-brand-primary px-2 md:px-4">
       <div className="image-container flex items-center justify-center">
      
      <Image
        src={getImageUrl(vendor.store_logo)}
        alt={`${vendor.store_name} logo`}
        width={0} // Required by Next.js when not using fill
        height={0} // Allows the browser to determine height
        sizes="100vw"
        style={{ width: 'auto', height: 'auto' }} // Maintains intrinsic aspect ratio
        className="max-w-40 h-auto" // Ensures it doesn't overflow its parent
        unoptimized // As per your requirement to bypass Next.js optimization
      />
    </div>
         {/* <div>
           <h1 className="text-sm md:text-xl font-extrabold">{vendor.store_name}</h1>
           <p className="text-gray-500">Contact: {vendor_detail.email}</p>
         </div> */}
       </div>
       </Section>
        <Section >
          <div className="store-description-container">
            <div dangerouslySetInnerHTML={{ __html: vendor.store_description }} />
          </div>
        </Section>
        <Section>
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Products</h2>
            <span className="text-sm text-gray-500">{pagination.total} Items found</span>
            </div>
        <ProductList 
            initialProducts={products} 
            initialHasMore={pagination?.hasMore}
            slug={slug}
        />
        </Section>

    </div>
  );
}