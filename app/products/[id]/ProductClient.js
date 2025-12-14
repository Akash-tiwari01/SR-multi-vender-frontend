// app/products/[id]/ProductClient.js
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByIdRequest } from "@/redux/products/productSlice";
import ProductView from "@/components/ProductView";
import InfinityLoader from "@/components/InfinityLoader";

export default function ProductClient({ id }) {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdRequest(id));
    }
  }, [id, dispatch]);

  if (loading) return <InfinityLoader />;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return <ProductView product={product} />;
}
