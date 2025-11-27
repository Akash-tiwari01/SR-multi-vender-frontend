"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/container/header/Header";
import ProductView from "@/components/ProductView";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByIdRequest } from "@/redux/products/productSlice";

export default function ProductPage() {
  const dispatch = useDispatch();
  const { id } = useParams();       // Get dynamic route param

  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdRequest(id));
    }
  }, [id]);  // runs when id is available

  return (
    <>
      <Header />

      <div>
        {loading ? (
          <p>Loading product…</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <ProductView product={product} />
        )}
      </div>
    </>
  );
}
