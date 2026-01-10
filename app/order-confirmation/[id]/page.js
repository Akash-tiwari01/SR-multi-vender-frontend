'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  Phone,
  MapPin,
  Home,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function OrderConfirmationPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id && params.id !== 'success') {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Success Header */}
        <div className='text-center mb-8'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <CheckCircle2 className='w-12 h-12 text-green-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Order Placed Successfully!
          </h1>
          <p className='text-gray-600'>
            Thank you for your order. We've sent a confirmation email with order
            details.
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className='space-y-6'>
            {/* Order Summary Card */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Package className='w-5 h-5 text-blue-600' />
                <h2 className='text-xl font-semibold text-gray-900'>
                  Order #{order.order_id}
                </h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>Order Date</p>
                  <p className='font-medium text-gray-900'>
                    {new Date(
                      order.order_date || order.createdAt
                    ).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Total Amount</p>
                  <p className='font-semibold text-gray-900 text-lg'>
                    ₹{order.total_amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Payment Method</p>
                  <p className='font-medium text-gray-900'>
                    {order.payment_method === 'COD'
                      ? 'Cash on Delivery'
                      : 'Online Payment'}
                  </p>
                </div>
              </div>

              <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                <p className='text-sm text-blue-800'>
                  <strong>Status:</strong> {order.status}
                  {order.payment_method === 'COD' &&
                    ' - Payment will be collected at delivery'}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <MapPin className='w-5 h-5 text-blue-600' />
                <h2 className='text-xl font-semibold text-gray-900'>
                  Delivery Address
                </h2>
              </div>

              <div className='text-gray-700'>
                <p className='font-medium'>{order.customer?.name}</p>
                <p>{order.address?.address_1}</p>
                {order.address?.landmark && <p>{order.address.landmark}</p>}
                <p>
                  {order.address?.city}, {order.address?.state} -{' '}
                  {order.address?.pin}
                </p>
                <div className='mt-3 flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4 text-gray-500' />
                    <span>{order.customer?.phone}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail className='w-4 h-4 text-gray-500' />
                    <span>{order.customer?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Package className='w-5 h-5 text-blue-600' />
                <h2 className='text-xl font-semibold text-gray-900'>
                  Order Items
                </h2>
              </div>

              <div className='space-y-3'>
                {order.products?.map((item, idx) => (
                  <div
                    key={idx}
                    className='flex justify-between items-center py-3 border-b last:border-b-0'
                  >
                    <div>
                      <p className='font-medium text-gray-900'>{item.name}</p>
                      <p className='text-sm text-gray-600'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-900'>
                        ₹{(item.sale_price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-4 pt-4 border-t space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium'>
                    ₹{order.sub_total?.toLocaleString()}
                  </span>
                </div>
                {order.delivery_charges > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Delivery Charges</span>
                    <span className='font-medium'>
                      ₹{order.delivery_charges}
                    </span>
                  </div>
                )}
                <div className='flex justify-between text-base font-semibold pt-2 border-t'>
                  <span>Total</span>
                  <span>₹{order.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Multi-vendor Notice */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <p className='text-sm text-blue-800'>
                <strong>Note:</strong> If your order contains items from
                multiple vendors, you may receive separate shipments with
                different tracking numbers.
              </p>
            </div>
          </div>
        )}

        {/* Generic Success (when order details not available) */}
        {!order && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
            <p className='text-gray-700 mb-6'>
              Your order has been placed successfully. You will receive an email
              confirmation shortly.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href='/products'
            className='inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors'
          >
            <Home className='w-5 h-5' />
            Continue Shopping
          </Link>
          {order && (
            <Link
              href='/user/profile'
              className='inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors'
            >
              <Package className='w-5 h-5' />
              View All Orders
            </Link>
          )}
        </div>

        {/* Help Section */}
        <div className='mt-12 text-center'>
          <p className='text-gray-600 mb-2'>Need help with your order?</p>
          <Link
            href='/ContactUS'
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
