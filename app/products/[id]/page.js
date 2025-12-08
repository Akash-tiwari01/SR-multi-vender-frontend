"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/container/header/Header";
import ProductView from "@/components/ProductView";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByIdRequest } from "@/redux/products/productSlice";
import Image from "next/image";
import InfinityLoader from "@/components/InfinityLoader";

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
      <div>
        {loading ? (
          <div className="w-full"> <InfinityLoader/> </div>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <ProductView product={product} />
        )}
      </div>
    </>
  );
}
