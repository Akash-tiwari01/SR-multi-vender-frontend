'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import {
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectCartByVendor,
  updateQuantity,
  removeFromCart,
  syncCartFromStorage,
} from '@/redux/cart/cartSlice';
import VendorCartSection from '@/components/cart/VendorCartSection';
import CartSummary from '@/components/cart/CartSummary';
import Link from 'next/link';

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const subtotal = useSelector(selectCartTotal);
  const cartByVendor = useSelector(selectCartByVendor);

  // Sync cart from localStorage on mount
  useEffect(() => {
    dispatch(syncCartFromStorage());
  }, [dispatch]);

  const handleUpdateQuantity = (productId, variationId, newQuantity) => {
    dispatch(
      updateQuantity({
        product: productId,
        variation: variationId,
        quantity: newQuantity,
      })
    );
  };

  const handleRemoveItem = (productId, variationId) => {
    dispatch(
      removeFromCart({
        product: productId,
        variation: variationId,
      })
    );
  };

  // Calculate delivery charges (₹60 per vendor as per backend logic)
  const vendorCount = Object.keys(cartByVendor).length;
  const deliveryCharges = vendorCount * 60;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='container mx-auto px-4 max-w-7xl'>
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
              <ShoppingCart className='w-16 h-16 text-gray-400' />
            </div>
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              Your cart is empty
            </h2>
            <p className='text-gray-600 mb-8'>
              Looks like you haven't added any items to your cart yet
            </p>
            <Link
              href='/products'
              className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/products'
            className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            Continue Shopping
          </Link>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
            <ShoppingCart className='w-8 h-8' />
            Shopping Cart
            <span className='text-xl font-normal text-gray-600'>
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items - Left Side */}
          <div className='lg:col-span-2 space-y-4'>
            {Object.entries(cartByVendor).map(([vendorId, { items }]) => {
              // Get vendor name from first item (if available)
              const vendorName = items[0]?.vendorName || `Vendor ${vendorId}`;

              return (
                <VendorCartSection
                  key={vendorId}
                  vendorId={vendorId}
                  vendorName={vendorName}
                  items={items}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              );
            })}

            {/* Multi-vendor notice */}
            {vendorCount > 1 && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-sm text-blue-800'>
                  <strong>Note:</strong> Your order contains items from{' '}
                  {vendorCount} different vendors. You will receive separate
                  shipments and may have different delivery times.
                </p>
              </div>
            )}
          </div>

          {/* Cart Summary - Right Side */}
          <div className='lg:col-span-1'>
            <CartSummary
              itemCount={itemCount}
              subtotal={subtotal}
              deliveryCharges={deliveryCharges}
              discount={0}
              isCodAvailable={true}
            />
          </div>
        </div>

        {/* Trust Badges */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
              <ShoppingCart className='w-6 h-6 text-blue-600' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>Free Shipping</h3>
              <p className='text-sm text-gray-600'>On orders above ₹999</p>
            </div>
          </div>
          <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm'>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>Secure Payment</h3>
              <p className='text-sm text-gray-600'>100% secure transactions</p>
            </div>
          </div>
          <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm'>
            <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
              <svg
                className='w-6 h-6 text-orange-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
                />
              </svg>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>Easy Returns</h3>
              <p className='text-sm text-gray-600'>7 days return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
