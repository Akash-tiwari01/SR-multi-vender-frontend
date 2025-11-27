"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../Header/page";

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "fertilizer enhancing soil health",
      price: 699,
      oldPrice: 1399,
      qty: 1,
      image: "/frame.png",
    },
    {
      id: 2,
      name: "fertilizer enhancing soil health",
      price: 699,
      oldPrice: 1499,
      qty: 1,
      image: "/frame.png",
    },
    {
      id: 3,
      name: "fertilizer enhancing soil health",
      price: 699,
      oldPrice: 1599,
      qty: 1,
      image: "/frame.png",
    },
  ]);

  const handleQtyChange = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <>
    <Header/>
      <div className="full_part w-100%">
        {/* 🛒 Cart Open Button */}
        {/* <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
      >
        🛒 View Cart
      </button> */}
      

        {/* 🔲 Overlay */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          />
        )}

        {/* 🧾 Sidebar */}
        <div
          className={`relative mt-8 top-0 right-0 h-full w-100 sm:w-120 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">SHOPPING CART</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-red-600 text-2xl"
            >
              <Link href="/CartSidebar">✕</Link>
              {/* ✕ */}
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-col justify-between flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      ₹{item.oldPrice}
                    </span>
                    <span className="text-red-600 font-semibold">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(item.id, -1)}
                      className="w-6 h-6 border border-gray-400 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, 1)}
                      className="w-6 h-6 border border-gray-400 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between font-semibold text-gray-800">
              <p>Subtotal:</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <p className="text-xs text-gray-500">
              Tax included. Shipping calculated at checkout.
            </p>
            <button className="w-full py-2 border border-black font-medium hover:bg-gray-100">
              <Link href="/ViewCart">VIEW CART</Link>
            </button>
            <button className="w-full py-2 bg-red-600 text-white font-semibold hover:bg-red-700">
              PLACE ORDER
            </button>
            <button className="w-full py-2 bg-orange-600 text-white font-semibold hover:bg-orange-700">
              PAY VIA RAZORPAY / PAYTM
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
