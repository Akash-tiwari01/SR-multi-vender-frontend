'use client';

import { Package, Truck, Tag, Store, Info } from 'lucide-react';
import Image from 'next/image';

/**
 * Pure display component — shows cart items and price breakdown.
 * All coupon logic is handled by CheckoutPage and passed in via `discount` prop.
 */
export default function OrderSummary({
  validatedCart = [],
  deliveryCharges = 0,
  codCharges = 0,
  discount = 0,
}) {
  // Group items by vendor
  const vendorGroups = {};
  validatedCart.forEach((item) => {
    const vendorKey =
      typeof item.vendor === 'string'
        ? item.vendor
        : item.vendor?._id?.toString() || item.vendor?.toString() || 'unknown';
    if (!vendorGroups[vendorKey]) {
      vendorGroups[vendorKey] = { items: [], vendorName: item.vendorName || 'Vendor' };
    }
    vendorGroups[vendorKey].items.push(item);
  });

  const subtotal = validatedCart.reduce(
    (sum, item) =>
      sum + parseFloat(item.sale_price || item.regular_price || 0) * item.quantity,
    0
  );

  const total = subtotal + deliveryCharges + codCharges - discount;

  return (
    <div className="flex flex-col gap-0">
      {/* Items */}
      <div className="max-h-64 overflow-y-auto space-y-4 pb-4">
        {Object.entries(vendorGroups).map(([vendorKey, group]) => (
          <div key={vendorKey}>
            <div className="flex items-center gap-1.5 mb-2">
              <Store className="w-3 h-3 text-brand-secondary shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 truncate">
                {group.vendorName}
              </span>
            </div>
            <div className="space-y-3">
              {group.items.map((item, idx) => {
                const itemKey = `${item.product}_${item.variation || idx}`;
                const price = parseFloat(item.sale_price || item.regular_price || 0);
                return (
                  <div key={itemKey} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-brand-primary line-clamp-2 leading-tight">{item.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs font-black text-brand-primary">₹{price.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">× {item.quantity}</span>
                        <span className="ml-auto text-xs font-bold text-slate-600">
                          ₹{(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-slate-100 pt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">Subtotal</span>
          <span className="font-bold text-brand-primary">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Truck className="w-3 h-3 text-brand-accent" /> Delivery
          </span>
          <span className={`font-bold ${deliveryCharges > 0 ? 'text-brand-primary' : 'text-green-600'}`}>
            {deliveryCharges > 0 ? `+ ₹${deliveryCharges}` : 'FREE'}
          </span>
        </div>

        {codCharges > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">COD Fee</span>
            <span className="font-bold text-brand-primary">+ ₹{codCharges}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-xs bg-green-50 border border-green-100 rounded-lg px-2 py-1.5">
            <span className="text-green-600 font-bold flex items-center gap-1">
              <Tag className="w-3 h-3" /> Coupon Savings
            </span>
            <span className="text-green-600 font-black">− ₹{discount.toLocaleString()}</span>
          </div>
        )}

        {/* Grand Total */}
        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Payable</p>
            <p className="text-2xl font-black text-brand-primary tracking-tighter">
              ₹{Math.max(0, total).toLocaleString()}
            </p>
          </div>
          <span className="px-2 py-1 bg-brand-secondary text-brand-primary text-[9px] font-black rounded uppercase tracking-tighter">
            GST Incl.
          </span>
        </div>
      </div>

      {/* Multi-vendor notice */}
      {Object.keys(vendorGroups).length > 1 && (
        <div className="mt-3 px-3 py-2 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-brand-primary shrink-0" />
          <p className="text-[10px] font-bold text-brand-primary">
            {Object.keys(vendorGroups).length} vendors — items arrive separately.
          </p>
        </div>
      )}
    </div>
  );
}