// app/orders/page.js
import { Suspense } from 'react';
import OrderList from './components/OrderList';
import OrderSkeleton from '@/app/order-confirmation/[id]/component/OrderSkeleton';

export default function OrdersPage() {
  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="mt-2 text-gray-600">
            Check the status of recent orders, manage returns, and download invoices.
          </p>
        </header>

        {/* Suspense handles the loading state while the API call is in progress */}
        <Suspense fallback={<OrderSkeleton />}>
          <OrderList />
        </Suspense>
      </div>
    </section>
  );
}