"use client";

import { useState } from "react";
import Image from "next/image";
import React from "react";
import Head from "next/head";
import Header from "../Header/page";
import Footer from "../footer/page";
import Link from "next/link";
import ReactImageMagnify from "react-image-magnify";

export default function AddtoCart() {
  // State for image and quantity
  const [mainImage, setMainImage] = useState("/MEN.webp");
  const [quantity, setQuantity] = useState(1);

  // Handlers
  const changeImage = (src) => setMainImage(src);
  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // 1. DATA: Define the product details (in a real app, this would come from an API call)
  const product = {
    skuCode: "ABCDEFG",
    brandName: "Multi-Vendor",
    material: "Furtilier",
    careInstruction:
      "Follow the manufacturer's recommended application rate and method exactly to prevent plant burn or environmental harm.",
    productDescription:
      "Decorate your home & office walls with these artistic design Satin Matt Texture Framed UV Art Painting from eCraftIndia. Each design reflects the artistic qualities and time one has taken to design this painting. Exquisitely printed and framed, loved ones and family members. These frames don't include glass so it is very light weight and wet cloth can be used to clean it.",
  };

  // 2. RENDERING: Helper component for the individual lines
  const DetailItem = ({ label, value }) => (
    <p className="detail-item">
      <span className="label-bold">{label} - </span>
      {value}
    </p>
  );

  // State for a simple interaction (e.g., clicking the review button)
  const [isReviewFormOpen, setIsReviewFormOpen] = React.useState(false);

  const Star = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`
      transition-colors duration-200 
      ${filled ? "text-red-500" : "text-gray-300"}
    `}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  return (
    <>
      {/* // ---------------Include Header File--------------- */}
      <Header />

      <div>
        <div className="containers">
          <div className="breadcrumb">
            <a href="/">Home</a> › A chemical or natural substance added to soil
            to increase its fertility.
          </div>

          <div className="product-section">
            {/* Left: Images */}
            <div className="image-gallery">
              <div className="main-image">
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "Fertilizer image",
                      isFluidWidth: true,
                      src: mainImage,
                    },
                    largeImage: {
                      src: mainImage,
                      width: 1200,
                      height: 900,
                    },
                    enlargedImageContainerDimensions: {
                      width: "100%",
                      height: "100%",
                    },
                    enlargedImagePosition:
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? "over" // ✅ on mobile
                        : "beside", // ✅ on desktop/tablet
                  }}
                />
                {/* <Image
                  id="mainImage"
                  src={mainImage}
                  alt="Lovely Rain View Painting"
                  width={300}
                  height={300}
                /> */}
              </div>

              <div className="thumbnails">
                {[
                  "/MEN.webp",
                  "/furtilizer1.png",
                  "/firtilizer2.png",
                  "/furtilizer3.png",
                ].map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt="thumbnail"
                    width={100}
                    height={200}
                    onClick={() => changeImage(src)}
                    className="cursor-pointer border hover:opacity-80"
                  />
                ))}
              </div>
            </div>

            {/* Quantity Controls */}
            {/* <div className="quantity-controls mt-4">
            <button onClick={decrease}>-</button>
            <input
              id="qty"
              type="number"
              value={quantity}
              readOnly
              className="mx-2 text-center w-12"
            />
            <button onClick={increase}>+</button>
          </div> */}

            {/* <!-- Right: Details --> */}
            <div className="details">
              <h2>Nutrient boost for better plant growth.</h2>
              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>5.0 Rating</span>
              </div>
              <div className="price">
                <span className="current">₹495.00</span>
                <span className="old">₹899.00</span>
                <span className="discount">45% Off</span>
              </div>
              <p className="sku">SKU: ABCDEFGH</p>

              <div className="quantity-controls mt-2">
                <div className="increse-decrese">
                  <button className="buttoni" onClick={decrease}>
                    -
                  </button>
                  <input
                    id="qty"
                    type="number"
                    value={quantity}
                    readOnly
                    className="mx-2 text-center w-12"
                  />
                  <button className="buttoni" onClick={increase}>
                    +
                  </button>
                </div>
              </div>

              <div className="buttons">
                <button className="buy">
                  <Link href="/CartSidebar">BUY IT NOW</Link>
                </button>
                {/* <Link href="/CartSlidebar"> <button className="buy">BUY IT NOW</button> </Link> */}
                <button className="cart">
                  <Link href="ViewCart">ADD TO CART</Link>
                </button>
                {/* <Link href="ViewCart">AADD TO CART</Link> */}
              </div>

              <p className="delivery">
                🚚 Order Delivery by <b>Tuesday, 11th November</b> or earlier.
              </p>

              <div className="offers">
                <p>
                  🎁 10% off on purchase above ₹1000. Use code <b>ABCDEF</b>
                </p>
                <p>
                  🎁 20% off on purchase above ₹2500. Use code <b>CDEFGH</b>
                </p>
              </div>

              <div className="icons">
                <div>
                  <Image src="/Auth.jpg" alt="" width={200} height={100} />
                  {/* <p>100% Authentic</p> */}
                </div>
                <div>
                  <Image
                    src="/freeShiping.jpg"
                    alt=""
                    width={100}
                    height={100}
                  />
                  {/* <p>Free Shipping</p> */}
                </div>
                <div>
                  <Image src="/CodAva.jpg" alt="" width={100} height={100} />
                  {/* <p>COD Available</p> */}
                </div>
                <div>
                  <Image src="/EasyRe.jpg" alt="" width={100} height={100} />
                  {/* <p>Easy Returns</p> */}
                </div>
                <div>
                  <Image src="/Makein.jpg" alt="" width={100} height={100} />
                  {/* <p>Made in India</p> */}
                </div>
              </div>
              {/* ---------------------Description ------------------ */}

              <Head>
                <title>
                  {product.brandName} - {product.paintingTheme}
                </title>
              </Head>
              <div className="Description-Container">
                {/* Product Description Header */}
                <div className="description-header-box">
                  <h2 className="description-title">Description</h2>
                </div>

                {/* Product Details Section */}
                <div className="product-details">
                  <DetailItem label="SKU Code" value={product.skuCode} />
                  <DetailItem label="Brand Name" value={product.brandName} />
                  <DetailItem label="Material" value={product.material} />
                  <DetailItem
                    label="Care Instruction"
                    value={product.careInstruction}
                  />
                  <DetailItem
                    label="Product Description"
                    value={product.productDescription}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Customer Reviews Section (Based on image_db4506.png) */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 sm:mb-0">
                Customer Reviews
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              {/* Rating Section */}
              <div className="flex items-center space-x-3">
                <div className="flex space-x-0.5">
                  {/* Five unfilled stars as seen in the image */}
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} filled={false} />
                  ))}
                </div>
                <p className="text-base text-gray-600">
                  Be the first to write a review
                </p>
              </div>

              {/* Write a Review Button */}
              <button
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="mt-4 sm:mt-0 px-6 py-2 border-2 border-gray-400 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-50 transition duration-150 active:shadow-none"
                aria-expanded={isReviewFormOpen}
              >
                Write a review
              </button>
            </div>

            {/* Mock Review Form (Opens on click) */}
            {isReviewFormOpen && (
              <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Submit Your Review
                </h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 mb-3"
                  rows="4"
                  placeholder="Share your thoughts about the product..."
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsReviewFormOpen(false)}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------Description ------------------ */}

        {/* ------------------------Related Product--------------- */}
        <div>
          <div className="relatedProduct">
            <h1 className="related-Head">Related Product</h1>
          </div>
        </div>
        <div className="main-Cart">
          {/* ////////////////Product1////////// */}
          <div className="product-card">
            <div className="product-image">
              <Image
                src="/MEN.webp"
                alt="Lord Ganesha Idol"
                className="main-img"
                height={200}
                width={200}
              />
              <Image
                src="/fertiliz.png"
                alt="Lord Ganesha Idol Hover"
                className="hover-img"
                height={200}
                width={200}
                objectFit="cover"
              />
            </div>

            <div className="product-details">
              <h3>
                High-quality fertilizer enhancing soil health and promoting
                rapid plant growth.
              </h3>
              <div className="price">
                <span className="current">₹699.00</span>
                <span className="old">₹1,099.00</span>
                <span className="discount">37% Off</span>
              </div>
              <button className="cart-btn">ADD TO CART</button>
            </div>
          </div>
          {/* -------------------------Product2--------------- */}
          <div className="product-card">
            <div className="product-image">
              <Image
                src="/MEN.webp"
                alt="Lord Ganesha Idol"
                className="main-img"
                height={200}
                width={200}
              />
              <Image
                src="/fertiliz.png"
                alt="Lord Ganesha Idol Hover"
                className="hover-img"
                height={200}
                width={200}
                objectFit="cover"
              />
            </div>

            <div className="product-details">
              <h3>
                High-quality fertilizer enhancing soil health and promoting
                rapid plant growth.
              </h3>
              <div className="price">
                <span className="current">₹699.00</span>
                <span className="old">₹1,099.00</span>
                <span className="discount">37% Off</span>
              </div>
              <button className="cart-btn">ADD TO CART</button>
            </div>
          </div>
          {/* ------------------------Product3--------------- */}
          <div className="product-card">
            <div className="product-image">
              <Image
                src="/MEN.webp"
                alt="Lord Ganesha Idol"
                className="main-img"
                height={200}
                width={200}
              />
              <Image
                src="/fertiliz.png"
                alt="Lord Ganesha Idol Hover"
                className="hover-img"
                height={200}
                width={200}
                objectFit="cover"
              />
            </div>

            <div className="product-details">
              <h3>
                High-quality fertilizer enhancing soil health and promoting
                rapid plant growth.
              </h3>
              <div className="price">
                <span className="current">₹699.00</span>
                <span className="old">₹1,099.00</span>
                <span className="discount">37% Off</span>
              </div>
              <button className="cart-btn">ADD TO CART</button>
            </div>
          </div>
          {/* -------------------------Product4--------------- */}
          <div className="product-card">
            <div className="product-image">
              <Image
                src="/MEN.webp"
                alt="Lord Ganesha Idol"
                className="main-img"
                height={200}
                width={200}
              />
              <Image
                src="/fertiliz.png"
                alt="Lord Ganesha Idol Hover"
                className="hover-img"
                height={200}
                width={200}
                objectFit="cover"
              />
            </div>

            <div className="product-details">
              <h3>
                High-quality fertilizer enhancing soil health and promoting
                rapid plant growth.
              </h3>
              <div className="price">
                <span className="current">₹699.00</span>
                <span className="old">₹1,099.00</span>
                <span className="discount">37% Off</span>
              </div>
              <button className="cart-btn">ADD TO CART</button>
            </div>
          </div>
          {/* ------------------------Product5--------------- */}
          <div className="product-card">
            <div className="product-image">
              <Image
                src="/MEN.webp"
                alt="Lord Ganesha Idol"
                className="main-img"
                height={200}
                width={200}
              />
              <Image
                src="/fertiliz.png"
                alt="Lord Ganesha Idol Hover"
                className="hover-img"
                height={200}
                width={200}
                objectFit="cover"
              />
            </div>

            <div className="product-details">
              <h3>
                High-quality fertilizer enhancing soil health and promoting
                rapid plant growth.
              </h3>
              <div className="price">
                <span className="current">₹699.00</span>
                <span className="old">₹1,099.00</span>
                <span className="discount">37% Off</span>
              </div>
              <button className="cart-btn">ADD TO CART</button>
            </div>
          </div>
          {/* -------------------------Product6--------------- */}
          <div className="product-card">
            <div className="product-image">
              <Image
                src="/MEN.webp"
                alt="Lord Ganesha Idol"
                className="main-img"
                height={200}
                width={200}
              />
              <Image
                src="/fertiliz.png"
                alt="Lord Ganesha Idol Hover"
                className="hover-img"
                height={200}
                width={200}
                objectFit="cover"
              />
            </div>

            <div className="product-details">
              <h3>
                High-quality fertilizer enhancing soil health and promoting
                rapid plant growth.
              </h3>
              <div className="price">
                <span className="current">₹699.00</span>
                <span className="old">₹1,099.00</span>
                <span className="discount">37% Off</span>
              </div>
              <button className="cart-btn">ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>

      {/* // ---------------Include Footer File--------------- */}
      <Footer />
    </>
  );
}
