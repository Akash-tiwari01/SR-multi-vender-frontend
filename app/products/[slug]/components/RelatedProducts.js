import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/helperFunction";
import ProductCard from "@/components/ProductCard";
import Section from "@/components/container/genericContainer/Section";

export default function RelatedProducts({ products }) {
  return (
    <Section className="mt-2">
      <h2 className="text-lg font-semibold mb-4">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard product={product} key={product.product_id}/>
        ))}
      </div>
    </Section>
  );
}
