'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, Package, Truck, Mail, 
  Phone, MapPin, Home, ReceiptText, ArrowRight 
} from 'lucide-react';
import OrderSkeleton from './OrderSkeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5000';

export default function OrderConfirmationClient({ params }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
          const date = new Date(data.order_date || data.createdAt);
          setFormattedDate(date.toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
          }));
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (resolvedParams.id && resolvedParams.id !== 'success') fetchOrder();
  }, [resolvedParams.id]);

  if (loading) return <OrderSkeleton />;
  if (!order) return <EmptyState />;

  return (
    <div className='min-h-screen bg-slate-50/50 pb-20 font-sans antialiased text-brand-primary'>
      
      {/* Header: Subtle Green Accent */}
      <header className='bg-white border-b border-slate-200 pt-16 pb-12 mb-10'>
        <div className='container mx-auto px-4 text-center'>
          <div className='w-16 h-16 bg-brand-accent/10 rounded-md flex items-center justify-center mx-auto mb-5 border border-brand-accent/20'>
            <CheckCircle2 className='w-10 h-10 text-brand-accent' strokeWidth={1.5} />
          </div>
          <h1 className='text-3xl font-bold mb-2 tracking-tight'>Order Confirmed</h1>
          <p className='text-slate-500 text-sm'>
            Thank you for your purchase. We've sent the details to <span className='font-semibold text-brand-primary'>{order.customer?.email}</span>
          </p>
        </div>
      </header>

      <main className='container mx-auto px-4 max-w-5xl'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          
          {/* Column 1 & 2: Main Details */}
          <div className='lg:col-span-2 space-y-6'>
            
            {/* Items Table Card */}
            <div className='bg-white rounded-md border border-slate-200 shadow-sm'>
              <div className='px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50'>
                <div className='flex items-center gap-2'>
                  <Package size={16} className='text-brand-secondary' />
                  <span className='font-bold text-sm uppercase tracking-wider'>Shipment Details</span>
                </div>
                <span className='text-xs font-medium px-2 py-1 bg-brand-primary text-white rounded-md'>
                  ID: #{order.order_id}
                </span>
              </div>
              
              <div className='p-6 divide-y divide-slate-100'>
                {order.products?.map((item, idx) => (
                  <div key={idx} className='py-4 first:pt-0 last:pb-0 flex justify-between items-center'>
                    <div className='space-y-1'>
                      <p className='font-semibold text-sm'>{item.name}</p>
                      <p className='text-xs text-slate-500'>Quantity: {item.quantity}</p>
                    </div>
                    <div className='text-right'>
                      <p className='font-bold text-sm'>₹{(item.sale_price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Shipping Address */}
              <div className='p-6 bg-white rounded-md border border-slate-200 shadow-sm'>
                <h3 className='text-xs font-bold uppercase text-slate-400 mb-4 flex items-center gap-2 tracking-widest'>
                  <MapPin size={14} className='text-brand-secondary'/> Delivery Address
                </h3>
                <div className='text-sm space-y-1'>
                  <p className='font-bold text-brand-primary'>{order.customer?.name}</p>
                  <p className='text-slate-600'>{order.address?.address_1}</p>
                  <p className='text-slate-600'>{order.address?.city}, {order.address?.state} - {order.address?.pin}</p>
                </div>
              </div>

              {/* Delivery Status */}
              <div className='p-6 bg-white rounded-md border border-slate-200 shadow-sm'>
                <h3 className='text-xs font-bold uppercase text-slate-400 mb-4 flex items-center gap-2 tracking-widest'>
                  <Truck size={14} className='text-brand-secondary'/> Order Status
                </h3>
                <div className='space-y-2'>
                  <span className='inline-block px-3 py-1 bg-brand-accent/10 text-brand-accent text-xs font-bold rounded-md border border-brand-accent/20 capitalize'>
                    {order.status}
                  </span>
                  <p className='text-xs text-slate-500 mt-2'>Payment via <span className='font-bold uppercase'>{order.payment_method}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Summary Sidebar */}
          <aside className='space-y-4'>
            <div className='bg-brand-primary text-white p-8 rounded-md shadow-sm border border-white/10'>
              <h3 className='font-bold mb-6 flex items-center gap-2 text-brand-secondary border-b border-white/10 pb-4'>
                <ReceiptText size={18}/> Bill Summary
              </h3>
              <div className='space-y-4 text-sm'>
                <div className='flex justify-between opacity-70'>
                  <span>Subtotal</span>
                  <span>₹{order.sub_total?.toLocaleString()}</span>
                </div>
                <div className='flex justify-between opacity-70'>
                  <span>Shipping</span>
                  <span>{order.delivery_charges > 0 ? `₹${order.delivery_charges}` : 'FREE'}</span>
                </div>
                <div className='pt-4 mt-4 border-t border-white/10 flex justify-between text-xl font-bold text-white'>
                  <span>Total</span>
                  <span className='text-brand-secondary'>₹{order.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link href="/products" className='group w-full py-4 bg-brand-secondary text-brand-primary rounded-md flex items-center justify-center gap-2 font-bold hover:bg-white border border-brand-secondary transition-all duration-300'>
              <Home size={18}/> 
              <span>Back to Store</span>
              <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
            </Link>
          </aside>

        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className='text-center p-12 bg-white rounded-md border border-slate-200'>
        <Package size={48} className='mx-auto text-slate-200 mb-4' />
        <h2 className='text-xl font-bold mb-2'>Order Not Found</h2>
        <Link href="/" className='text-brand-secondary font-bold hover:underline'>Return to Home</Link>
      </div>
    </div>
  );
}