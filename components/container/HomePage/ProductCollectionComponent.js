// ProductCollectionComponent.jsx (SERVER COMPONENT)

import dynamic from "next/dynamic";

// import ProductSlider from "./ProductSlider";
const ProductSlider = dynamic(()=>import('@/components/container/HomePage/ProductSlider'),{
  loading: ()=><p>Loading Products...</p>
});

export default function ProductCollectionComponent({
  title,
  description,
  products,
}) {

  return (
    <section className="container mx-auto px-4 py-8 bg-white">
      <div className="max-w-8xl mx-auto ">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {title}
        </h2>

        <div
          className="text-center text-base text-gray-600 mb-10"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <ProductSlider products={products} />
    </section>
  );
}
