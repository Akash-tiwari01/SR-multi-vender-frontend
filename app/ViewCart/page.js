"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "../footer/page";
import Header from "../Header/page";

export default function ViewCart() {
  // 🧱 Dummy Product Data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Essential compounds that enrich soil with vital nutrients like nitrogen, phosphorus, and potassium, promoting rapid growth, stronger roots, and abundant yields for healthy plants.",
      price: 1999,
      oldPrice: 3999,
      quantity: 1,
      image: "/MEN.webp",
    },
    {
      id: 2,
      name: "Essential compounds that enrich soil with vital nutrients like nitrogen, phosphorus, and potassium, promoting rapid growth, stronger roots, and abundant yields for healthy plants.",
      price: 999,
      oldPrice: 1399,
      quantity: 1,
      image: "/MEN.webp",
    },
    {
      id: 3,
      name: "Essential compounds that enrich soil with vital nutrients like nitrogen, phosphorus, and potassium, promoting rapid growth, stronger roots, and abundant yields for healthy plants.",
      price: 699,
      oldPrice: 1399,
      quantity: 1,
      image: "/MEN.webp",
    },
  ]);

  // 🔄 Handle Quantity Change
  const handleQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  // 🧮 Calculate Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-2xl md:text-3xl font-semibold text-red-600 mb-8">
          SHOPPING CART
        </h1>

        {/* Table Header (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-6 font-semibold text-gray-600 border-b pb-2 mb-2">
          <div className="col-span-2">Product</div>
          <div className="text-center">Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-right">Total</div>
          <div className="text-center">Action</div>
        </div>

        {/* Cart Items */}
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-6 items-center border-b pb-4 gap-4"
            >
              {/* Image & Name */}
              <div className="flex items-center gap-4 col-span-2">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
                <p className="text-sm text-gray-700">{item.name}</p>
              </div>

              {/* Price */}
              <div className="text-center text-gray-700">
                <span className="line-through text-gray-400 mr-1">
                  ₹{item.oldPrice}
                </span>
                <span className="text-red-500 font-semibold">
                  ₹{item.price}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex justify-center items-center space-x-2">
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => handleQuantity(item.id, "dec")}
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => handleQuantity(item.id, "inc")}
                >
                  +
                </button>
              </div>

              {/* Total */}
              <div className="text-right font-semibold text-gray-800">
                ₹{item.price * item.quantity}
              </div>

              {/* 🗑️ Remove Button */}
              <div className="text-center">
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm transition"
                  onClick={() =>
                    setCartItems((prev) =>
                      prev.filter((cartItem) => cartItem.id !== item.id)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon, Note & Summary */}
        <div className="mt-10 flex flex-col lg:flex-row justify-between gap-8">
          {/* Left Section */}
          <div className="w-full lg:w-2/3">
            {/* Coupon */}
            <div>
              <h2 className="font-semibold mb-2">Coupon:</h2>
              <input
                type="text"
                placeholder="Coupon code"
                className="border p-2 w-full sm:w-2/3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <p className="text-gray-500 text-sm mt-1">
                Coupon code will work on checkout page
              </p>
            </div>

            {/* Note */}
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Add Order Note</h2>
              <textarea
                placeholder="How can we help you?"
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                rows={3}
              ></textarea>
            </div>
          </div>

          {/* Right Section (Summary) */}
          <div className="w-full lg:w-1/3 bg-gray-50 p-5 rounded-lg shadow-md">
            <div className="text-lg font-semibold mb-4">
              SUBTOTAL:{" "}
              <span className="text-red-600 font-bold text-xl">
                ₹{subtotal}
              </span>
              <p className="mt-2 text-sm text-gray-500">
                Tax included. Shipping and discounts calculated at checkout.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button className="w-full sm:w-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition">
                PLACE ORDER
              </button>
              <button className="w-full sm:w-1/2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition">
                PAY VIA RAZORPAY / PAYTM
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
