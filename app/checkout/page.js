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
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
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

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [addressData, setAddressData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
        discount: 0,
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

  // Calculate totals
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
        
        {/* Progress Stepper - Enhanced contrast */}
        <div className='mb-12 max-w-2xl mx-auto'>
          <div className='flex items-center justify-between relative'>
            {/* Progress Line Background */}
            <div className='absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0'></div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className='relative z-10 flex flex-col items-center gap-3'>
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all duration-300
                    ${step >= s 
                      ? 'bg-brand-secondary border-brand-secondary text-brand-primary shadow-[0_0_15px_rgba(218,172,71,0.3)]' 
                      : 'bg-white border-gray-300 text-gray-400'}
                  `}
                >
                  {step > s ? <CheckCircle2 className='w-6 h-6' /> : s}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= s ? 'text-brand-primary' : 'text-gray-400'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 items-start'>
          
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
                    className='flex-1 bg-white border-2 border-gray-200 hover:border-brand-primary text-gray-600 font-bold py-4 rounded-xl transition-all'
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handleContinueToReview}
                    disabled={!paymentMethod}
                    className='flex-1 bg-brand-primary hover:bg-black text-brand-secondary disabled:bg-gray-200 disabled:text-gray-400 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-brand-primary/20'
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

          {/* Right Side - Order Summary (Sticky) */}
          <div className='lg:col-span-1 lg:sticky lg:top-8'>
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
              <div className='bg-brand-primary p-4'>
                <h2 className='text-white font-bold text-center uppercase tracking-widest text-sm'>Order Summary</h2>
              </div>
              <div className='p-6'>
                <OrderSummary
                  validatedCart={validatedCart || []}
                  deliveryCharges={deliveryCharges}
                  codCharges={codCharges}
                  discount={0}
                />
                
                {/* Brand Accent Pink touch for "Trust" */}
                <div className='mt-6 pt-6 border-t border-dashed border-gray-200'>
                  <div className='flex items-center gap-3 text-brand-accent-pink'>
                    <div className='w-2 h-2 rounded-full bg-brand-accent-pink animate-pulse'></div>
                    <span className='text-xs font-bold uppercase tracking-tight'>100% Secure Transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
