'use client';

import React, { Suspense, useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeft,Truck, Loader2, ShieldCheck, CreditCard, MapPin, ListChecks } from 'lucide-react';
import Link from 'next/link';

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

// --- Order Orchestration ---
const handlePlaceOrder = async () => {
  if (!product || !addressData || !paymentMethod) {
    return toast.error('Please complete all checkout steps');
  }

  setIsPlacingOrder(true);
  
  // Production Constants
  const deliveryCharges = 60;
  const salePrice = parseFloat(product.sale_price || product.regular_price || 0);
  const totalAmount = salePrice + deliveryCharges;

  // SOLID: Data Transformation Logic
  // Hum "addressData" se customer aur address dono objects ko map kar rahe hain
  const orderData = {
    status: 'PROCESSING',
    is_paid: paymentMethod === 'ONLINE',
    payment_method: paymentMethod,
    discount: 0,
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
    <div className="flex items-center justify-center p-4 bg-slate-50 min-h-[90vh]">
      <Toaster position="top-right" />
      
      {/* Main Container: Fixed Height 70vh */}
      <div className="w-full max-w-5xl h-[75vh] bg-white  border border-brand-primary/5 overflow-hidden flex flex-col">
        
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

        {/* Content Body: Two Columns */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Column: Form Steps (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide border-r border-slate-50">
            <div className="space-y-4 max-w-xl mx-auto">
              
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

          {/* Right Column: Order Summary (Scrollable) */}
          <aside className="w-80 bg-slate-50/50 overflow-y-auto p-6 shrink-0">
            <div className="h-full flex flex-col">
              <h3 className="text-xs font-black text-brand-primary uppercase tracking-tighter mb-4 opacity-50">Order Summary</h3>
              <div className="flex-1">
                <OrderSummary
                  validatedCart={[product]}
                  deliveryCharges={60}
                  codCharges={paymentMethod === 'COD' ? 60 : 0}
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 text-brand-primary/40 grayscale hover:grayscale-0 transition-all cursor-default">
                  <Truck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Express 48h Delivery</span>
                </div>
              </div>
            </div>
          </aside>
          
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