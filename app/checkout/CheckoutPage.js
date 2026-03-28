'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import {
  selectCartItems,
  selectValidatedCart,
  selectIsCodAvailable,
  selectCartStatus,
  selectValidationErrors,
  validateCartRequest,
  clearCart,
  syncCartFromStorage,
} from '@/redux/cart/cartSlice';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSummary from '@/components/checkout/OrderSummary';
import { CheckCircle2, ArrowLeft, Loader2, Tag, X, XCircle, ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import Link from 'next/link';
import InfinityLoader from '@/components/InfinityLoader';

const API_URL = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5000';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector(selectCartItems);
  const validatedCart = useSelector(selectValidatedCart);
  const isCodAvailable = useSelector(selectIsCodAvailable);
  const cartStatus = useSelector(selectCartStatus);
  const validationErrors = useSelector(selectValidationErrors);

  const [step, setStep] = useState(1);
  const [addressData, setAddressData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // ── Coupon State (all managed here, not in OrderSummary) ──
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponsLoaded, setCouponsLoaded] = useState(false);

  const couponDiscount = appliedCoupon?.discount_amount || 0;

  // ── Totals (computed early so coupon handlers + render all use same values) ──
  const subtotal =
    validatedCart?.reduce(
      (sum, item) =>
        sum +
        parseFloat(item.sale_price || item.regular_price || 0) * item.quantity,
      0
    ) || 0;

  const vendorCount = validatedCart
    ? new Set(validatedCart.map((item) => item.vendor)).size
    : 0;
  const deliveryCharges = vendorCount * 60;
  const codCharges = paymentMethod === 'COD' ? vendorCount * 60 : 0;

  console.log(cartItems);
  // Sync cart and validate on mount
  useEffect(() => {
    dispatch(syncCartFromStorage());
    
    if (cartItems.length > 0) {
      dispatch(validateCartRequest());
    }
  }, [dispatch]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && cartStatus !== 'validating') {
      toast.error('Your cart is empty!');
      router.push('/cart');
    }
  }, [cartItems, cartStatus, router]);

  // Show validation errors
  useEffect(() => {
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [validationErrors]);

  const handleAddressSubmit = (data) => {
    setAddressData(data);
    setStep(2);
    toast.success('Address saved!');
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleContinueToReview = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setStep(3);
  };

  // ── Coupon Handlers ──
  const applyCouponCode = async (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) { setCouponError('Please enter a coupon code.'); return; }
    if (subtotal <= 0) { setCouponError('Validate your cart first.'); return; }
    setCouponLoading(true);
    setCouponError('');
    setShowCoupons(false);
    console.log('[Coupon] Applying:', trimmed, '| Subtotal:', subtotal);
    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, cart_total: subtotal }),
      });
      const data = await res.json();
      console.log('[Coupon] Response:', data);
      if (!res.ok || !data.valid) {
        setCouponError(data.message || 'Invalid coupon code.');
      } else {
        setAppliedCoupon({ ...data.coupon, discount_amount: data.discount_amount });
        setCouponInput('');
        setCouponError('');
        toast.success(data.coupon.message || `Coupon applied! You save ₹${data.discount_amount}`);
      }
    } catch (err) {
      console.error('[Coupon] Error:', err);
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

  const handlePlaceOrder = async () => {
    if (!addressData || !paymentMethod || !validatedCart) {
      toast.error('Please complete all steps');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Calculate charges
      const vendorCount = new Set(validatedCart.map((item) => item.vendor))
        .size;
      const deliveryCharges = vendorCount * 60;
      const codCharges = paymentMethod === 'COD' ? vendorCount * 60 : 0;

      // Prepare order data
      const orderData = {
        status: 'PROCESSING',
        is_paid: paymentMethod === 'ONLINE',
        payment_method: paymentMethod,
        discount: couponDiscount,
        coupon_code: appliedCoupon?.code || null,
        delivery_charges: deliveryCharges,
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
        },
        products: validatedCart.map((item) => ({
          product: item.product,
          slug: item.slug,
          name: item.name,
          quantity: item.quantity,
          sale_price: parseFloat(item.sale_price || item.regular_price || 0),
          regular_price: parseFloat(item.regular_price || item.sale_price || 0),
          image: item.image || '',
        })),
      };

      // If online payment, create Razorpay order first
      if (paymentMethod === 'ONLINE') {
        const razorpayResponse = await fetch(
          `${API_URL}/api/razorpay/create-order`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount:
                (validatedCart.reduce(
                  (sum, item) =>
                    sum +
                    parseFloat(item.sale_price || item.regular_price || 0) *
                      item.quantity,
                  0
                ) +
                  deliveryCharges) *
                100, // Convert to paise
              currency: 'INR',
            }),
          }
        );

        if (!razorpayResponse.ok) {
          throw new Error('Failed to create payment order');
        }

        const razorpayData = await razorpayResponse.json();

        // Initialize Razorpay
        const options = {
          key: razorpayData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: 'Multi-Vendor Store',
          description: 'Order Payment',
          order_id: razorpayData.order_id,
          handler: async function (response) {
            // Payment successful, create order
            await createOrder(orderData, response);
          },
          prefill: {
            name: addressData.name,
            email: addressData.email,
            contact: addressData.phone,
          },
          theme: {
            color: '#3B82F6',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        razorpay.on('payment.failed', function (response) {
          toast.error('Payment failed. Please try again.');
          setIsPlacingOrder(false);
        });
      } else {
        // COD order - create directly
        await createOrder(orderData);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  const createOrder = async (orderData, paymentResponse = null) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          payment_response: paymentResponse,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

      // Clear cart
      dispatch(clearCart());

      toast.success('Order placed successfully!');

      // Redirect to confirmation page
      router.push(`/order-confirmation/${data.orders?.[0]?._id || 'success'}`);
    } catch (error) {
      throw error;
    } finally {
      setIsPlacingOrder(false);
    }
  };



  if (cartStatus === 'validating') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <InfinityLoader/>
          <p className='text-gray-600'>Validating your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50/50 pb-20'>
      <Toaster position='top-right' />
      
      {/* Premium Header */}
      <nav className='bg-brand-primary border-b border-brand-secondary/20 py-6 mb-8 shadow-xl'>
        <div className='container mx-auto px-4 max-w-7xl flex items-center justify-between'>
          <Link
            href='/cart'
            className='group inline-flex items-center gap-2 text-brand-accent font-medium transition-all hover:translate-x-[-4px]'
          >
            <ArrowLeft className='w-5 h-5 group-hover:text-brand-secondary' />
            <span className='hidden sm:inline'>Return to Cart</span>
          </Link>
          <h1 className='text-2xl font-bold text-white tracking-tight uppercase italic'>
            Secure <span className='text-brand-secondary'>Checkout</span>
          </h1>
          <div className='w-10 sm:w-20'></div> {/* Spacer */}
        </div>
      </nav>

      <div className='container mx-auto px-4 max-w-7xl'>
        
        {/* Progress Stepper - Mobile Optimized */}
        <div className='mb-8 md:mb-12 max-w-2xl mx-auto px-2'>
          <div className='flex items-center justify-between relative'>
            <div className='absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0'></div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className='relative z-10 flex flex-col items-center gap-2'>
                <div
                  className={`
                    flex items-center justify-center w-10 md:w-12 h-10 md:h-12 rounded-full border-2 font-bold transition-all duration-300
                    ${step >= s 
                      ? 'bg-brand-secondary border-brand-secondary text-brand-primary shadow-lg shadow-brand-secondary/20' 
                      : 'bg-white border-gray-300 text-gray-400'}
                  `}
                >
                  {step > s ? <CheckCircle2 className='w-5 md:w-6 h-5 md:h-6' /> : <span className='text-sm md:text-base'>{s}</span>}
                </div>
                <span className={`text-[9px] md:text-xs font-black uppercase tracking-wider text-center ${step >= s ? 'text-brand-primary' : 'text-gray-400'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
          
          {/* Main Content Area */}
          <div className='lg:col-span-2 space-y-8'>
            
            {/* Step 1: Address Section */}
            {step === 1 && (
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='bg-gray-50 px-6 py-4 border-b border-gray-100'>
                  <h2 className='text-lg font-bold text-brand-primary'>Shipping Information</h2>
                </div>
                <div className='p-6'>
                  <AddressForm onSubmit={handleAddressSubmit} initialData={addressData} />
                </div>
              </div>
            )}

            {/* Step 2: Payment Section */}
            {step === 2 && (
              <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                  <PaymentMethod
                    isCodAvailable={isCodAvailable}
                    onSelect={handlePaymentSelect}
                    selectedMethod={paymentMethod}
                  />
                </div>
                
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <button
                      onClick={() => setStep(1)}
                      className='order-2 sm:order-1 flex-1 bg-white border-2 border-gray-200 hover:border-brand-primary text-gray-600 font-bold py-4 rounded-xl transition-all'
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={handleContinueToReview}
                      disabled={!paymentMethod}
                      className='order-1 sm:order-2 flex-1 bg-brand-primary hover:bg-black text-brand-secondary disabled:bg-gray-200 disabled:text-gray-400 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-brand-primary/20'
                    >
                      Continue to Review
                    </button>
                  </div>
              </div>
            )}

            {/* Step 3: Review Section */}
            {step === 3 && (
              <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Summary Card: Address */}
                  <div className='bg-white rounded-2xl shadow-sm border-t-4 border-brand-secondary p-6 relative'>
                    <h3 className='text-sm font-bold text-brand-primary uppercase tracking-widest mb-4'>Delivery To</h3>
                    <div className='text-gray-600 leading-relaxed'>
                      <p className='font-bold text-gray-900'>{addressData?.name}</p>
                      <p>{addressData?.address_1}</p>
                      <p>{addressData?.city}, {addressData?.state} - {addressData?.pin}</p>
                      <p className='mt-2 font-medium text-brand-primary'>{addressData?.phone}</p>
                    </div>
                    <button onClick={() => setStep(1)} className='absolute top-6 right-6 text-xs font-bold text-brand-accent hover:underline uppercase'>Edit</button>
                  </div>

                  {/* Summary Card: Payment */}
                  <div className='bg-white rounded-2xl shadow-sm border-t-4 border-brand-accent p-6 relative'>
                    <h3 className='text-sm font-bold text-brand-primary uppercase tracking-widest mb-4'>Payment Mode</h3>
                    <p className='text-xl font-bold text-gray-900 mb-1'>
                      {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                    <p className='text-sm text-gray-500'>Via Secure Gateway</p>
                    <button onClick={() => setStep(2)} className='absolute top-6 right-6 text-xs font-bold text-brand-accent hover:underline uppercase'>Change</button>
                  </div>
                </div>

                {/* Final CTA */}
                <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                  <button
                    onClick={() => setStep(2)}
                    className='flex-1 bg-white border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl'
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className='flex-[2] bg-brand-primary hover:bg-black text-brand-secondary font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70'
                  >
                    {isPlacingOrder ? (
                      <Loader2 className='w-6 h-6 animate-spin' />
                    ) : (
                      'COMPLETE PURCHASE'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side — Coupon + Order Summary */}
          <div className='lg:col-span-1 order-first lg:order-last lg:sticky lg:top-6 space-y-4'>
            

            {/* ── COUPON BOX ── */}
            <div className='bg-brand-primary rounded-2xl overflow-hidden shadow-lg'>
              <div className='px-4 py-3 flex items-center gap-2'>
                <Ticket className='w-4 h-4 text-brand-secondary' />
                <h3 className='text-sm font-black text-brand-secondary uppercase tracking-tight'>Have a Coupon?</h3>
              </div>
              <div className='bg-white rounded-xl mx-3 mb-3 p-4 space-y-3'>
                {appliedCoupon ? (
                  <div className='flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <CheckCircle2 className='w-4 h-4 text-green-600 shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-xs font-black text-green-700 uppercase tracking-wide'>{appliedCoupon.code}</p>
                        <p className='text-[10px] text-green-600 truncate'>
                          {appliedCoupon.message || `You save ₹${appliedCoupon.discount_amount}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setAppliedCoupon(null); setCouponError(''); }}
                      className='ml-2 shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 hover:bg-red-100 text-green-600 hover:text-red-500 transition-colors'
                    >
                      <X className='w-3.5 h-3.5' />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && applyCouponCode(couponInput)}
                        placeholder='ENTER COUPON CODE'
                        className='flex-1 min-w-0 text-xs font-mono font-black tracking-widest border-2 border-slate-200 focus:border-brand-secondary rounded-xl px-3 py-2.5 outline-none transition-colors placeholder:text-slate-300 placeholder:font-normal uppercase'
                      />
                      <button
                        onClick={() => applyCouponCode(couponInput)}
                        disabled={couponLoading}
                        className='shrink-0 px-4 py-2.5 bg-brand-primary text-brand-secondary font-black text-xs uppercase rounded-xl hover:bg-black transition-colors disabled:opacity-60 flex items-center gap-1'
                      >
                        {couponLoading ? <Loader2 className='w-3 h-3 animate-spin' /> : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <div className='flex items-start gap-1.5'>
                        <XCircle className='w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5' />
                        <p className='text-[11px] text-red-500 font-medium'>{couponError}</p>
                      </div>
                    )}
                    <button
                      onClick={loadAvailableCoupons}
                      className='flex items-center gap-1.5 text-[11px] font-bold text-brand-primary hover:underline'
                    >
                      {showCoupons ? <ChevronUp className='w-3 h-3' /> : <ChevronDown className='w-3 h-3' />}
                      {showCoupons ? 'Hide coupons' : 'View available coupons'}
                    </button>
                    {showCoupons && (
                      <div className='space-y-2 max-h-48 overflow-y-auto'>
                        {availableCoupons.length === 0 ? (
                          <p className='text-[11px] text-slate-400 text-center py-2'>No coupons available.</p>
                        ) : availableCoupons.map((c) => (
                          <div
                            key={c._id}
                            onClick={() => applyCouponCode(c.code)}
                            className='cursor-pointer border border-dashed border-brand-secondary/60 rounded-xl p-2.5 bg-brand-secondary/5 hover:bg-brand-secondary/15 transition-colors'
                          >
                            <div className='flex items-center justify-between gap-2 mb-1'>
                              <span className='font-black text-xs text-brand-primary tracking-widest'>{c.code}</span>
                              <span className='shrink-0 text-[10px] font-bold text-brand-secondary bg-brand-primary px-2 py-0.5 rounded-full'>
                                {c.discount_type === 'PERCENTAGE' ? `${c.discount}% off` : `₹${c.discount} off`}
                              </span>
                            </div>
                            <p className='text-[10px] text-slate-500'>
                              Min ₹{c.min_cart_value}
                              {c.max_discount ? ` · Cap ₹${c.max_discount}` : ''}
                              {c.expiry_date ? ` · Expires ${new Date(c.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
              <div className='bg-brand-primary p-4'>
                <h2 className='text-white font-bold text-center uppercase tracking-widest text-sm'>Order Summary</h2>
              </div>
              <div className='p-4'>
                <OrderSummary
                  validatedCart={validatedCart || []}
                  deliveryCharges={deliveryCharges}
                  codCharges={codCharges}
                  discount={couponDiscount}
                />
              </div>
              <div className='px-4 pb-4 flex items-center gap-3 text-brand-accent-pink'>
                <div className='w-2 h-2 rounded-full bg-brand-accent-pink animate-pulse'></div>
                <span className='text-xs font-bold uppercase tracking-tight'>100% Secure Transaction</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
