// app/orders/components/OrderCard.js
export default function OrderCard({ order }) {
    const { _id, createdAt, totalAmount, status, items } = order;
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Card Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center text-sm">
          <div className="flex gap-8">
            <div>
              <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Order Placed</p>
              <p className="font-medium text-gray-800">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Total</p>
              <p className="font-medium text-gray-800">${(totalAmount / 100).toFixed(2)}</p>
            </div>
          </div>
          <p className="text-gray-400 font-mono">#{_id.slice(-8).toUpperCase()}</p>
        </div>
  
        {/* Card Body */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 overflow-hidden">
               {/* Preview of first 3 items */}
               {items.slice(0, 3).map((item, i) => (
                 <div key={i} className="h-12 w-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                   Item
                 </div>
               ))}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
  
          <div className="flex items-center gap-4 w-full md:w-auto">
            <StatusBadge status={status} />
            <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  function StatusBadge({ status }) {
    const styles = {
      'Processing': 'bg-blue-50 text-blue-700 border-blue-100',
      'Shipped': 'bg-purple-50 text-purple-700 border-purple-100',
      'Delivered': 'bg-green-50 text-green-700 border-green-100',
      'Cancelled': 'bg-red-50 text-red-700 border-red-100',
    };
  
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50'}`}>
        {status}
      </span>
    );
  }