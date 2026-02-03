// app/orders/components/OrderList.js
import OrderCard from './OrderCard';

async function fetchUserOrders() {
  // Replace with your full internal or external URL
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/`, {
    cache: 'no-store', // Ensures fresh data on every visit
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
}

export default async function OrderList() {
  const orders = await fetchUserOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border shadow-sm">
        <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}