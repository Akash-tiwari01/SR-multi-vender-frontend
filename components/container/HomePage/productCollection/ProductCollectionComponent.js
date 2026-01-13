import dynamic from "next/dynamic";
import Section from "../../genericContainer/Section";
import InfinityLoader from "@/components/InfinityLoader";


const ProductSlider = dynamic(()=>import('@/components/container/HomePage/productCollection/ProductSlider'),{
  loading: ()=><InfinityLoader/>
});

export default function ProductCollectionComponent({
  title,
  description,
  collection_product_component,
}) {
const { products = [] } = collection_product_component?.product_collection ?? {};

if (products && products?.length>0)
  return (
    <Section className=" mx-auto px-4 py-8 bg-white">
      <div className="max-w-8xl mx-auto">
        {title && <h2 className="text-3xl font-bold mb-4 text-brand-primary text-center">
          {title}
        </h2>}
        <div
          className="text-center text-base text-brand-secondary mb-5"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <ProductSlider products={products} />
    </Section>
  );
return <></>;
}
