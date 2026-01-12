'use client';

import { ShoppingBag, Tag, Truck, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartSummary({
  itemCount,
  subtotal,
  deliveryCharges = 0,
  discount = 0,
  isCodAvailable = true,
  onCheckout,
  isValidating = false,
}) {
  const router = useRouter();
  const total = subtotal + deliveryCharges - discount;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
        <Receipt className='w-5 h-5' />
        Order Summary
      </h2>

      <div className='space-y-3 mb-6'>
        {/* Item Count */}
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600 flex items-center gap-2'>
            <ShoppingBag className='w-4 h-4' />
            Items ({itemCount})
          </span>
          <span className='font-medium text-gray-900'>
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        {/* Delivery Charges */}
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600 flex items-center gap-2'>
            <Truck className='w-4 h-4' />
            Delivery Charges
          </span>
          <span className='font-medium text-gray-900'>
            {deliveryCharges > 0 ? `₹${deliveryCharges}` : 'FREE'}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-green-600 flex items-center gap-2'>
              <Tag className='w-4 h-4' />
              Discount
            </span>
            <span className='font-medium text-green-600'>
              -₹{discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className='border-t border-gray-200 pt-3'>
          <div className='flex justify-between items-center'>
            <span className='text-base font-semibold text-gray-900'>
              Total Amount
            </span>
            <span className='text-2xl font-bold text-gray-900'>
              ₹{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* COD Availability */}
      {isCodAvailable && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-4'>
          <p className='text-sm text-green-800 font-medium'>
            ✓ Cash on Delivery Available
          </p>
        </div>
      )}

      {!isCodAvailable && (
        <div className='bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4'>
          <p className='text-sm text-orange-800 font-medium'>
            ⓘ COD not available for some items
          </p>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isValidating || itemCount === 0}
        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md'
      >
        {isValidating ? 'Validating...' : 'Proceed to Checkout'}
      </button>

      {/* Security Badge */}
      <div className='mt-4 text-center'>
        <p className='text-xs text-gray-500'>
          🔒 Secure checkout • Safe payment options
        </p>
      </div>
    </div>
  );
}
