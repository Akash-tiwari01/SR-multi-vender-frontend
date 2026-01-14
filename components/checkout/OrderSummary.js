'use client';

import { Package, Truck, Tag } from 'lucide-react';
import Image from 'next/image';

export default function OrderSummary({
  validatedCart = [],
  deliveryCharges = 0,
  codCharges = 0,
  discount = 0,
}) {
  // Group items by vendor
  const vendorGroups = {};
  validatedCart.forEach((item) => {
    const vendorId = item.vendor || 'unknown';
    if (!vendorGroups[vendorId]) {
      vendorGroups[vendorId] = [];
    }
    vendorGroups[vendorId].push(item);
  });

  const subtotal = validatedCart.reduce(
    (sum, item) =>
      sum +
      parseFloat(item.sale_price || item.regular_price || 0) * item.quantity,
    0
  );

  const total = subtotal + deliveryCharges + codCharges - discount;

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
          <Package className='w-5 h-5' />
          Order Summary
        </h2>
      </div>

      {/* Vendor-wise Items */}
      <div className='p-6 max-h-96 overflow-y-auto'>
        {Object.entries(vendorGroups).map(([vendorId, items]) => (
          <div key={vendorId} className='mb-6 last:mb-0'>
            <div className='text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200'>
              Vendor: {items[0]?.vendorName || `Vendor ${vendorId}`}
            </div>
            <div className='space-y-3'>
              {items.map((item, idx) => {
                const itemKey = `${item.product}_${item.variation || idx}`;
                const price = parseFloat(
                  item.sale_price || item.regular_price || 0
                );
                const itemTotal = price * item.quantity;

                return (
                  <div key={itemKey} className='flex gap-3'>
                    {item.image && (
                      <div className='w-16 h-16 shrink-0 rounded bg-gray-100 overflow-hidden relative'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium text-gray-900 truncate'>
                        {item.name}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Qty: {item.quantity} × ₹{price}
                      </p>
                      <p className='text-sm font-semibold text-gray-900'>
                        ₹{itemTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className='p-6 border-t border-gray-200 space-y-3'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Subtotal</span>
          <span className='font-medium text-gray-900'>
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-gray-600 flex items-center gap-1'>
            <Truck className='w-4 h-4' />
            Delivery Charges
          </span>
          <span className='font-medium text-gray-900'>
            {deliveryCharges > 0 ? `₹${deliveryCharges}` : 'FREE'}
          </span>
        </div>

        {codCharges > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>COD Charges</span>
            <span className='font-medium text-gray-900'>₹{codCharges}</span>
          </div>
        )}

        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-green-600 flex items-center gap-1'>
              <Tag className='w-4 h-4' />
              Discount
            </span>
            <span className='font-medium text-green-600'>
              -₹{discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className='pt-3 border-t border-gray-200'>
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

      {/* Multi-vendor Notice */}
      {Object.keys(vendorGroups).length > 1 && (
        <div className='p-4 bg-blue-50 border-t border-blue-200'>
          <p className='text-xs text-blue-800'>
            📦 Your order will be shipped in {Object.keys(vendorGroups).length}{' '}
            separate packages from different vendors
          </p>
        </div>
      )}
    </div>
  );
}
