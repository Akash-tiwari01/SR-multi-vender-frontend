'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, syncWishlistFromStorage, clearWishlist, clearWishlistRequest, fetchWishlistRequest } from '@/redux/wishlist/wishlistSlice';
import ProductCard from '@/components/ProductCard';
import { HeartOff, ArrowLeft, Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const rawWishlistItems = useSelector(selectWishlistItems);
  const token = useSelector((state) => state?.user?.token);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    dispatch(syncWishlistFromStorage());
    if (token) {
      dispatch(fetchWishlistRequest());
    }
  }, [dispatch, token]);

  // Prevent server-side hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center bg-slate-50">
        <div className="animate-spin text-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[80vh] py-10 px-4 md:px-8">
      <div className="container mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row shadow-sm justify-between items-start md:items-center bg-white p-6 rounded-2xl mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-brand-primary">
              <Heart className="text-rose-500" fill="currentColor" size={32} />
              My Wishlist
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              You have {rawWishlistItems.length} {rawWishlistItems.length === 1 ? 'item' : 'items'} in your wishlist.
            </p>
          </div>
          {rawWishlistItems.length > 0 && (
            <button 
              onClick={() => {
                if(confirm("Are you sure you want to clear your entire wishlist?")) {
                  if (token) {
                    dispatch(clearWishlistRequest());
                  } else {
                    dispatch(clearWishlist());
                  }
                }
              }}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <Trash2 size={18} />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {rawWishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-16 text-center">
            <HeartOff size={64} className="text-slate-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Save your favorite items here while you shop to easily find them later.
            </p>
            <Link 
              href="/"
              className="flex items-center gap-2 bg-brand-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-primary/90 transition-all hover:shadow-lg active:scale-95"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {rawWishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
