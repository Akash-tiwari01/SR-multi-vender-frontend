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
    <>
      <Toaster position='top-right' />
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4 max-w-7xl'>
          {/* Header */}
          <div className='mb-8'>
            <Link
              href='/cart'
              className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Cart
            </Link>
            <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className='mb-8'>
            <div className='flex items-center justify-center'>
              {[1, 2, 3].map((s) => (
                <div key={s} className='flex items-center'>
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold
                    ${
                      step >= s
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                  >
                    {step > s ? <CheckCircle2 className='w-6 h-6' /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-24 h-1 mx-2 ${
                        step > s ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className='flex justify-center mt-4 gap-24'>
              <span
                className={`text-sm font-medium ${
                  step >= 1 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                Address
              </span>
              <span
                className={`text-sm font-medium ${
                  step >= 2 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                Payment
              </span>
              <span
                className={`text-sm font-medium ${
                  step >= 3 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                Review
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Side - Forms */}
            <div className='lg:col-span-2'>
              {/* Step 1: Address */}
              {step === 1 && (
                <AddressForm
                  onSubmit={handleAddressSubmit}
                  initialData={addressData}
                />
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className='space-y-6'>
                  <PaymentMethod
                    isCodAvailable={isCodAvailable}
                    onSelect={handlePaymentSelect}
                    selectedMethod={paymentMethod}
                  />
                  <div className='flex gap-4'>
                    <button
                      onClick={() => setStep(1)}
                      className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors'
                    >
                      Back
                    </button>
                    <button
                      onClick={handleContinueToReview}
                      disabled={!paymentMethod}
                      className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className='space-y-6'>
                  {/* Address Summary */}
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <div className='flex justify-between items-start mb-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Delivery Address
                      </h3>
                      <button
                        onClick={() => setStep(1)}
                        className='text-sm text-blue-600 hover:text-blue-700'
                      >
                        Edit
                      </button>
                    </div>
                    <div className='text-gray-700'>
                      <p className='font-medium'>{addressData?.name}</p>
                      <p>{addressData?.address_1}</p>
                      {addressData?.landmark && <p>{addressData.landmark}</p>}
                      <p>
                        {addressData?.city}, {addressData?.state} -{' '}
                        {addressData?.pin}
                      </p>
                      <p className='mt-2'>Phone: {addressData?.phone}</p>
                      <p>Email: {addressData?.email}</p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <div className='flex justify-between items-start'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Payment Method
                      </h3>
                      <button
                        onClick={() => setStep(2)}
                        className='text-sm text-blue-600 hover:text-blue-700'
                      >
                        Change
                      </button>
                    </div>
                    <p className='text-gray-700 mt-2'>
                      {paymentMethod === 'COD'
                        ? 'Cash on Delivery'
                        : 'Online Payment'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-4'>
                    <button
                      onClick={() => setStep(2)}
                      className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors'
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className='flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2'
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin' />
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Order Summary */}
            <div className='lg:col-span-1'>
              <OrderSummary
                validatedCart={validatedCart || []}
                deliveryCharges={deliveryCharges}
                codCharges={codCharges}
                discount={0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
