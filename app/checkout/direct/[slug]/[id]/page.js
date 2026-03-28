'use client';

import React, { Suspense, useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeft, Truck, Loader2, ShieldCheck, CreditCard, MapPin, ListChecks, Ticket, CheckCircle2, XCircle, X, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5000';

// Internal Components
import AddressForm from '@/components/checkout/AddressForm';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSummary from '@/components/checkout/OrderSummary';
import InfinityLoader from '@/components/InfinityLoader';

// Service Layer
import { OrderService } from '@/modules/checkout/orderService';
import { useSelector } from 'react-redux';

const CheckoutLoading = () => (
  <div className="h-[70vh] flex items-center justify-center bg-white">
    <InfinityLoader />
  </div>
);

function DirectCheckoutContent({ paramsPromise }) {
  const router = useRouter();
  const { slug, id } = use(paramsPromise);
  const [product, setProduct] = useState(null);
  const [isCodAvailable, setIsCodAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [addressData, setAddressData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // ── Coupon State ──
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponsLoaded, setCouponsLoaded] = useState(false);

  const couponDiscount = appliedCoupon?.discount_amount || 0;

  // ── Subtotal and Charges ──
  const salePrice = parseFloat(product?.sale_price || product?.regular_price || 0);
  const subtotal = salePrice * 1; // Default quantity 1 for direct checkout
  const deliveryCharges = 60;
  const codCharges = paymentMethod === 'COD' ? 60 : 0;
  const totalAmount = subtotal + deliveryCharges + codCharges - couponDiscount;

  useEffect(() => {
    const initFetch = async () => {
      try {
        const data = await OrderService.fetchProduct(id);
        setProduct({ ...data, quantity: 1 });
        setIsCodAvailable(data?.is_cod_available ?? true);
      } catch (err) {
        toast.error(err.message);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, [id, router]);

  // ── Coupon Handlers ──
  const applyCouponCode = async (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) { setCouponError('Please enter a coupon code.'); return; }
    if (subtotal <= 0) { setCouponError('Invalid product price.'); return; }
    setCouponLoading(true);
    setCouponError('');
    setShowCoupons(false);
    console.log('[Coupon Direct] Applying:', trimmed, '| Subtotal:', subtotal);
    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, cart_total: subtotal }),
      });
      const data = await res.json();
      console.log('[Coupon Direct] Response:', data);
      if (!res.ok || !data.valid) {
        setCouponError(data.message || 'Invalid coupon code.');
      } else {
        setAppliedCoupon({ ...data.coupon, discount_amount: data.discount_amount });
        setCouponInput('');
        setCouponError('');
        toast.success(data.coupon.message || `Coupon applied! You save ₹${data.discount_amount}`);
      }
    } catch (err) {
      console.error('[Coupon Direct] Error:', err);
      setCouponError('Could not validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const loadAvailableCoupons = async () => {
    if (couponsLoaded) { setShowCoupons(v => !v); return; }
    try {
      const res = await fetch(`${API_URL}/api/coupons/all`);
      const data = await res.json();
      const now = new Date();
      const valid = (Array.isArray(data) ? data : []).filter(c => {
        if (c.expiry_date && new Date(c.expiry_date) < now) return false;
        if (c.usage_limit && c.used_count >= c.usage_limit) return false;
        return true;
      });
      setAvailableCoupons(valid);
      setCouponsLoaded(true);
      setShowCoupons(true);
    } catch (e) { /* silently fail */ }
  };

  // --- Order Orchestration ---
  const handlePlaceOrder = async () => {
    if (!product || !addressData || !paymentMethod) {
      return toast.error('Please complete all checkout steps');
    }

    setIsPlacingOrder(true);
    
    // SOLID: Data Transformation Logic
    const orderData = {
    status: 'PROCESSING',
    is_paid: paymentMethod === 'ONLINE',
    payment_method: paymentMethod,
    discount: couponDiscount,
    coupon_code: appliedCoupon?.code || null,
    delivery_charges: deliveryCharges,
    // Target Structure mapping
    address: {
      address_1: addressData.address_1,
      city: addressData.city,
      state: addressData.state,
      pin: addressData.pin,
      landmark: addressData.landmark || '',
    },
    customer: {
      name: addressData.name,
      phone: addressData.phone,
      email: addressData.email,
      // Agar user login hai toh id pass karein, varna addressData se lein
      customer: addressData.customer || null, 
    },
    products: [
      {
        product: product._id,
        slug: product.slug,
        name: product.name,
        quantity: 1, // Direct checkout mein quantity 1 default
        sale_price: salePrice,
        regular_price: parseFloat(product.regular_price || product.sale_price || 0),
        image: product.image || '',
      },
    ],
  };

  try {
    if (paymentMethod === 'ONLINE') {
      // Razorpay expects amount in paise (Rupees * 100)
      const rzpData = await OrderService.createRazorpayOrder(totalAmount * 100);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpData.amount,
        order_id: rzpData.order_id,
        handler: async (response) => {
          // Finalize order with both orderData and razorpay response
          const result = await OrderService.finalizeOrder(orderData, response);
          
          router.push(`/order-confirmation/${result.orders[0]._id }`);
        },
        prefill: { 
          email: addressData.email, 
          contact: addressData.phone,
          name: addressData.name 
        },
        theme: { color: '#051f20' } // Using your brand-primary color
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // COD Flow
      const result = await OrderService.finalizeOrder(orderData);
      // Backend key check: result.orderId or result._id
      console.log(result);
      alert(result)
      router.push(`/order-confirmation/${result.orders[0]._id }`);
    }
  } catch (err) {
    toast.error(err.message || "Failed to place order");
  } finally {
    setIsPlacingOrder(false);
  }
};

  if (loading) return <CheckoutLoading />;

  return (
    <div className='flex items-center justify-center p-0 md:p-4 bg-slate-50 min-h-screen md:min-h-[90vh]'>
      <Toaster position='top-right' />
      
      {/* Main Container: Mobile First (Full with on mobile, 75vh on desktop) */}
      <div className='w-full max-w-5xl md:h-[75vh] bg-white border-b md:border border-brand-primary/5 md:rounded-2xl md:shadow-2xl overflow-visible md:overflow-hidden flex flex-col'>
        
        {/* Compact Header */}
        <header className="px-6 py-4 border-b flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4">
            <Link href={`/${slug}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-brand-primary" />
            </Link>
            <div>
              <h1 className="font-black text-brand-primary text-xl tracking-tighter uppercase">Checkout</h1>
              <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-widest">Secure encrypted session</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/10 rounded-full border border-brand-accent/20">
            <ShieldCheck size={14} className="text-brand-accent" />
            <span className="text-[10px] font-bold text-brand-primary">SECURE PAY</span>
          </div>
        </header>

        {/* Content Body: Responsive Stack */}
        <div className='flex flex-col md:flex-row flex-1 overflow-visible md:overflow-hidden'>
          
          {/* Sidebar (Order Summary): Top on Mobile, Right on Desktop */}
          <aside className='w-full md:w-80 bg-slate-50/50 overflow-visible md:overflow-y-auto p-4 md:p-6 shrink-0 order-first md:order-last space-y-4 border-b md:border-b-0 md:border-l border-slate-100'>
            
            {/* ── COUPON BOX ── */}
            <div className='bg-brand-primary rounded-2xl overflow-hidden shadow-lg'>
              <div className='px-4 py-3 flex items-center gap-2'>
                <Ticket className='w-4 h-4 text-brand-secondary' />
                <h3 className='text-xs font-black text-brand-secondary uppercase tracking-tighter'>Have a Coupon?</h3>
              </div>
              <div className='bg-white rounded-xl mx-2 mb-2 p-3 space-y-3'>
                {appliedCoupon ? (
                  <div className='flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-2 py-2'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <CheckCircle2 className='w-3.5 h-3.5 text-green-600 shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-[10px] font-black text-green-700 uppercase tracking-tight'>{appliedCoupon.code}</p>
                        <p className='text-[9px] text-green-600 truncate'>
                          {appliedCoupon.message || `Saved ₹${appliedCoupon.discount_amount}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setAppliedCoupon(null); setCouponError(''); }}
                      className='ml-1 shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 hover:bg-red-100 text-green-600 hover:text-red-500 transition-colors'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className='flex gap-1.5'>
                      <input
                        type='text'
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && applyCouponCode(couponInput)}
                        placeholder='CODE'
                        className='flex-1 min-w-0 text-[10px] font-mono font-black tracking-widest border border-slate-200 focus:border-brand-secondary rounded-lg px-2 py-2 outline-none transition-colors placeholder:text-slate-300 placeholder:font-normal uppercase'
                      />
                      <button
                        onClick={() => applyCouponCode(couponInput)}
                        disabled={couponLoading}
                        className='shrink-0 px-3 py-2 bg-brand-primary text-brand-secondary font-black text-[10px] uppercase rounded-lg hover:bg-black transition-colors disabled:opacity-60 flex items-center gap-1'
                      >
                        {couponLoading ? <Loader2 className='w-3 h-3 animate-spin' /> : 'Apply'}
                      </button>
                    </div>

                    {couponError && (
                      <div className='flex items-start gap-1'>
                        <XCircle className='w-3 h-3 text-red-500 shrink-0 mt-0.5' />
                        <p className='text-[9px] text-red-500 font-medium leading-tight'>{couponError}</p>
                      </div>
                    )}

                    <button
                      onClick={loadAvailableCoupons}
                      className='flex items-center gap-1 text-[9px] font-bold text-brand-primary hover:underline'
                    >
                      {showCoupons ? <ChevronUp className='w-2.5 h-2.5' /> : <ChevronDown className='w-2.5 h-2.5' />}
                      {showCoupons ? 'Hide coupons' : 'View available coupons'}
                    </button>

                    {showCoupons && (
                      <div className='space-y-1.5 max-h-32 overflow-y-auto pr-1'>
                        {availableCoupons.length === 0 ? (
                          <p className='text-[9px] text-slate-400 text-center py-1'>No coupons available.</p>
                        ) : availableCoupons.map((c) => (
                          <div
                            key={c._id}
                            onClick={() => applyCouponCode(c.code)}
                            className='cursor-pointer border border-dashed border-brand-secondary/40 rounded-lg p-2 bg-brand-secondary/5 hover:bg-brand-secondary/10 transition-colors'
                          >
                            <div className='flex items-center justify-between gap-1 mb-0.5'>
                              <span className='font-black text-[10px] text-brand-primary tracking-widest'>{c.code}</span>
                              <span className='shrink-0 text-[8px] font-bold text-brand-secondary bg-brand-primary px-1.5 py-0.5 rounded-full'>
                                {c.discount_type === 'PERCENTAGE' ? `${c.discount}% off` : `₹${c.discount} off`}
                              </span>
                            </div>
                            <p className='text-[8px] text-slate-500'>
                              Min ₹{c.min_cart_value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className='flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-slate-100'>
              <h3 className='text-[10px] font-black text-brand-primary uppercase tracking-tighter mb-4 opacity-50'>Order Summary</h3>
              <div className='flex-1'>
                <OrderSummary
                  validatedCart={[product]}
                  deliveryCharges={deliveryCharges}
                  codCharges={codCharges}
                  discount={couponDiscount}
                />
              </div>
            </div>
          </aside>

          {/* Left Column: Form Steps (Scrollable correctly) */}
          <div className='flex-1 overflow-visible md:overflow-y-auto p-4 md:p-6 scrollbar-hide'>
            <div className='space-y-4 max-w-xl mx-auto'>
              
              <StepCard 
                icon={<MapPin size={18}/>} 
                title="Shipping Info" 
                active={step === 1} 
                completed={step > 1}
                onEdit={() => setStep(1)}
              >
                <AddressForm 
                  onSubmit={(data) => { setAddressData(data); setStep(2); }} 
                  initialData={addressData} 
                />
              </StepCard>

              <StepCard 
                icon={<CreditCard size={18}/>} 
                title="Payment" 
                active={step === 2} 
                completed={step > 2}
                onEdit={() => setStep(2)}
              >
                <PaymentMethod 
                  isCodAvailable={isCodAvailable} 
                  onSelect={setPaymentMethod} 
                  selectedMethod={paymentMethod} 
                />
                <button 
                  onClick={() => setStep(3)}
                  disabled={!paymentMethod}
                  className="w-full mt-4 bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  Confirm Method
                </button>
              </StepCard>

              <StepCard 
                icon={<ListChecks size={18}/>} 
                title="Review & Finish" 
                active={step === 3}
              >
                <div className="space-y-4">
                  <div className="p-3 bg-brand-accent/5 rounded-xl border border-brand-accent/20 text-[11px] text-brand-primary/70 leading-relaxed italic">
                    By clicking complete, you verify that the shipping address and item details are correct.
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-brand-primary text-brand-secondary py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-brand-secondary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    {isPlacingOrder ? <Loader2 className="animate-spin" /> : 'PLACE ORDER NOW'}
                  </button>
                </div>
              </StepCard>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Aesthetic Step Component
 */
function StepCard({ icon, title, active, completed, children, onEdit }) {
  return (
    <div className={`group transition-all duration-500 rounded-2xl border ${
      active 
        ? 'bg-white border-brand-secondary/30 shadow-xl' 
        : 'bg-slate-50/50 border-transparent opacity-60'
    }`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${
            active ? 'bg-brand-primary text-brand-secondary' : 'bg-slate-200 text-slate-500'
          }`}>
            {completed ? '✓' : icon}
          </div>
          <h2 className={`font-black uppercase tracking-tighter text-sm ${
            active ? 'text-brand-primary' : 'text-slate-500'
          }`}>{title}</h2>
        </div>
        {!active && completed && (
          <button onClick={onEdit} className="text-[10px] font-black text-brand-secondary hover:underline uppercase">Edit</button>
        )}
      </div>
      {active && <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>}
    </div>
  );
}

export default function DirectCheckoutPage({ params }) {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <DirectCheckoutContent paramsPromise={params} />
    </Suspense>
  );
}