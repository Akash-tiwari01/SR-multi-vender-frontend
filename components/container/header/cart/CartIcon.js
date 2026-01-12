'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCartIcon } from 'lucide-react';
import { toggleCart } from '@/modules/cart/cartSlice';

export default function CartIcon() {
  const dispatch = useDispatch();
  
  // Select only the items array to calculate count
  // Using a selector ensures this component only re-renders when item count changes
  const items = useSelector((state) => state.cart.items);
  
  // Calculate total quantity of all items
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleOpenCart = () => {
    dispatch(toggleCart()); // Opens the Sidebar Drawer we built
  };

  return (
    <button 
      className="relative p-2 group transition-all" 
      onClick={handleOpenCart}
      aria-label="Open Shopping Cart"
    >
      <ShoppingCartIcon 
        className="text-white group-hover:text-rose-200 cursor-pointer transition-colors" 
        size={24}
      />
      
      { (
        <span className="absolute top-3 right-2 transform translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-gray-900 animate-in zoom-in duration-300">
          {itemCount > 99 ? '99+' : itemCount ?? 0}
        </span>
      )}
    </button>
  );
}

