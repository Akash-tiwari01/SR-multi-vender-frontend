// app/products/[id]/page.js
import { Suspense } from "react";
import ProductClient from "./ProductClient";
import InfinityLoader from "@/components/InfinityLoader";

export default function ProductPage({ params }) {
  return (
    <Suspense fallback={<InfinityLoader />}>
      <ProductClient id={params.id} />
    </Suspense>
  );
}
