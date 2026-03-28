'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReturnRequest } from '@/modules/orders/state/orderSlice';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

/**
 * UI Component for individual order display.
 * @param {Object} props.order - The order data object.
 */
export const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const { isReturnLoading } = useSelector((state) => state.order);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnForm, setReturnForm] = useState({ order: order?._id, subject: '', message: '' });

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    dispatch(createReturnRequest(returnForm));
    setIsReturnModalOpen(false);
    toast.success("Return Request Processed.");
  };

  // Defensive check to avoid crashes if data is missing
  if (!order) return null;

  return (
    <div className="group border border-brand-primary/10 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header Section */}
      <div className="bg-brand-primary p-4 flex justify-between items-center">
        <div>
          <span className="text-brand-secondary text-[10px] font-black uppercase tracking-widest">Reference</span>
          <h3 className="text-white font-mono text-lg font-bold">#{order.order_id}</h3>
        </div>
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black ${
            order.status === 'PROCESSING' ? 'bg-brand-secondary text-brand-primary' : 'bg-brand-accent text-brand-primary'
          }`}>
            {order.status}
          </span>
          <p className="text-white/60 text-[10px] mt-1 italic">
            Ordered: {new Date(order.order_date).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="space-y-1">
          <h4 className="text-brand-primary font-bold text-xs mb-2 uppercase border-b border-brand-accent/30 pb-1">Customer</h4>
          <p className="text-gray-800 font-bold leading-tight">{order.customer?.name}</p>
          <p className="text-gray-500 text-xs">{order.customer?.email}</p>
          <p className="text-brand-accent-pink text-[11px] font-medium mt-2">
            📍 {order.address?.city}, {order.address?.state}
          </p>
        </div>

        {/* Product Items */}
        <div className="md:col-span-1">
          <h4 className="text-brand-primary font-bold text-xs mb-2 uppercase border-b border-brand-accent/30 pb-1">Line Items</h4>
          <div className="max-h-24 overflow-y-auto">
            {order.products?.map((item) => (
              <div key={item._id} className="flex justify-between text-xs mb-2 border-b border-gray-50 pb-1 last:border-0">
                <span className="text-gray-600 truncate max-w-[150px]">{item.name}</span>
                <span className="text-brand-primary font-bold bg-brand-accent/10 px-1 rounded">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center border-l-2 border-brand-secondary relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Payment</span>
            <span className="text-[10px] font-black text-brand-primary bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">
              {order.payment_method}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase">Grand Total</span>
            <div className="text-2xl font-black text-brand-primary leading-none">
               ₹{order.total_amount?.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Return Logic Snippet */}
          {order.status === 'DELIVERED' && (
             <div className="mt-4 flex justify-end">
                <button title="Request Return" onClick={() => setIsReturnModalOpen(true)} className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 font-bold px-3 py-1.5 rounded hover:bg-rose-500 hover:text-white transition-colors">
                   REQUEST RETURN
                </button>
             </div>
          )}
          {order.status === 'RETURN REQUEST' && (
             <div className="mt-4 flex justify-end">
                <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-600 font-bold px-3 py-1.5 rounded">
                   RETURN PROCESSING...
                </span>
             </div>
          )}
        </div>
      </div>

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative block">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-brand-primary tracking-tighter">Request Return <span className="font-mono bg-white px-2 py-1 rounded text-sm text-brand-secondary">#{order.order_id}</span></h3>
              <button title="Close Modal" onClick={() => setIsReturnModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                 <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleReturnSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Subject / Reason Category *</label>
                <select required value={returnForm.subject} onChange={(e) => setReturnForm({...returnForm, subject: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary">
                  <option value="" disabled>Select a reason...</option>
                  <option value="Damaged/Defective Item">Damaged/Defective Item</option>
                  <option value="Wrong Item Received">Wrong Item Received</option>
                  <option value="Changed Mind">Changed Mind</option>
                  <option value="Item Not as Described">Item Not as Described</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Detailed Message *</label>
                <textarea required value={returnForm.message} onChange={(e) => setReturnForm({...returnForm, message: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary min-h-[100px]" placeholder="Please provide specific details regarding this return..." />
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-4">
                 <button type="button" onClick={() => setIsReturnModalOpen(false)} className="px-6 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50">Cancel</button>
                 <button type="submit" disabled={isReturnLoading} className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors">
                    {isReturnLoading ? 'Submitting...' : 'Submit Request'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};