"use client";

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductsRequest } from "@/redux/products/productSlice";

export default function ProductList(){
    const dispatch = useDispatch();
    const {items: products, loading, error} = useSelector((state)=>state.products);

    useEffect(()=>{
        dispatch(fetchProductsRequest());
    },[dispatch]);

    if(loading) return <p>Loading products...</p>;
    if (error) return <p style={{color:'red'}}>Error: {error}</p>;
    console.log(products, "hello");
    return(
        <div>
            <h2>Product Catalog</h2>
            {products.length === 0 && !loading ? <p>No products found.</p> : null}

            {products.length !== 0 ?
                <ul>
                {products.products.map((product,index)=>(
                    <li key={index}>Product: {product.name || `Item ${index+1}`}</li>
                ))}
            </ul>:'wait'
            }
        </div>
    );
}
