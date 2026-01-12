'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, ChevronsRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { addToCart } from '@/redux/cart/cartSlice';
import { formatPrice } from '@/utils/helperFunction';
import VariationSelector from './VariationSelector';
import ProductSpecs from './ProductSpecs';

export default function ProductInfo() {
  const router = useRouter();
  const { currentProduct, selectedVariation, status } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
    console.log('selectedVariation: ',selectedVariation, "currentProduct:",currentProduct);
  if (!currentProduct) return null;

  const price = selectedVariation?.sale_price ?? currentProduct.sale_price;
  const regularPrice =
    selectedVariation?.regular_price ?? currentProduct.regular_price;
  const sku = selectedVariation?.sku ?? currentProduct.sku;
  const stock = selectedVariation?.stock ?? currentProduct.stock;
  const inStock = selectedVariation?.in_stock ?? currentProduct.in_stock;

  const handleAddToCart = () => {
    if (!inStock || stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    // Get product image
    const productImage =
      selectedVariation?.media?.[0] || currentProduct.media?.[0] || '';

    dispatch(
      addToCart({
        product: currentProduct._id,
        variation: selectedVariation?._id || null,
        quantity: 1,
        productData: {
          slug: currentProduct.slug,
          name: currentProduct.name,
          image: productImage,
          price: parseFloat(price) || 0,
          regularPrice: parseFloat(regularPrice) || parseFloat(price) || 0,
          vendor: currentProduct.vendor?._id || null,
          vendorName: currentProduct.vendor?.name || 'Unknown Vendor',
          stock: stock || 0,
        },
      })
    );

    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!inStock || stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    // Add to cart first
    const productImage =
      selectedVariation?.media?.[0] || currentProduct.media?.[0] || '';

    dispatch(
      addToCart({
        product: currentProduct._id,
        variation: selectedVariation?._id || null,
        quantity: 1,
        productData: {
          slug: currentProduct.slug,
          name: currentProduct.name,
          image: productImage,
          price: parseFloat(price) || 0,
          regularPrice: parseFloat(regularPrice) || parseFloat(price) || 0,
          vendor: currentProduct.vendor?._id || null,
          vendorName: currentProduct.vendor?.name || 'Unknown Vendor',
          stock: stock || 0,
        },
      })
    );

    // Redirect to checkout
    router.push('/checkout');
  };

  return (
    <div className='h-[80vh] lg:col-span-6 overflow-x-scroll scrollbar-hide px-4'>
      {/* Title */}
      <h1 className='text-3xl lg:text-4xl font-serif text-rose-900 mb-2'>
        {currentProduct.name || 'Untitled Product'}
      </h1>

      {/* Vendor */}
      {currentProduct.vendor?.name && (
        <div className='flex items-center gap-3 mb-6'>
          <span className='text-xs text-gray-600'>Sold By:</span>
          <button className='text-sm font-semibold text-rose-800'>
            {currentProduct.vendor.name}
          </button>
        </div>
      )}

      {/* Short Description */}
      <div className='details mb-3'>
        <p
          className='line-clamp-3 text-sm font-semibold text-gray-800 leading-relaxed mt-2 mb-1'
          dangerouslySetInnerHTML={{ __html: currentProduct.description }}
        />
        <button className='flex text-rose-800 group'>
          Read more
          <ChevronsRight className='h-6 stroke-1 group-hover:ml-2 transition-all' />
        </button>
      </div>

      {/* Price */}
      <div className='text-4xl font-bold text-rose-900 mb-6'>
        {formatPrice(price)}
      </div>

      {/* Stock Status */}
      {inStock && stock > 0 && stock <= 10 && (
        <div className='mb-4 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg'>
          <p className='text-sm text-orange-700 font-medium'>
            ⚠️ Only {stock} left in stock - Order soon!
          </p>
        </div>
      )}
      {(!inStock || stock <= 0) && (
        <div className='mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-sm text-red-700 font-medium'>❌ Out of Stock</p>
        </div>
      )}

      {/* Variations */}
      <VariationSelector />

      {/* Actions */}
      <div className='flex gap-4 mb-6 mt-4'>
        <button
          onClick={handleAddToCart}
          disabled={!inStock || stock <= 0}
          className='flex-1 bg-rose-900 text-white py-3 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-800 transition-colors'
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!inStock || stock <= 0}
          className='flex-1 border border-rose-900 text-rose-900 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-50 transition-colors'
        >
          Buy Now
        </ButtonSecondary>

        <button className='w-12 h-12 border rounded flex items-center justify-center hover:bg-gray-50 transition-colors'>
          ♡
        </button>
      </div>

      {/* Trust Badges */}
      <div className='border-t'>
        <div className='flex gap-10  flex-wrap justify-center '>
          {currentProduct?.cod_available && (
            <div className='flex items-center gap-1 flex-col'>
              <div className='w-14 h-14 rounded-full flex items-center justify-center overflow-hidden'>
                <Image
                  src={'/icons/cash-on-delivery.png'}
                  alt='icon'
                  width={40}
                  height={40}
                />
              </div>
              <div className='text-sm font-medium capitalize text-center'>
                COD Available
              </div>
            </div>
          )}
          {
            <div className='flex items-center gap-1 flex-col'>
              <div className='w-14 h-14 rounded-full flex items-center justify-center overflow-hidden'>
                <Image
                  src={'/icons/authenticity.png'}
                  alt='icon'
                  width={40}
                  height={40}
                />
              </div>
              <div className='text-sm font-medium capitalize text-center'>
                100% Authentic
              </div>
            </div>
          }
          {currentProduct?.return_available && (
            <div className='flex items-center gap-1 flex-col'>
              <div className='w-14 h-14 rounded-full flex items-center justify-center overflow-hidden'>
                <Image
                  src={'/icons/return.png'}
                  alt='icon'
                  width={40}
                  height={40}
                />
              </div>
              <div className='text-sm font-medium capitalize text-center'>
                7 days return
              </div>
            </div>
          )}
          {currentProduct?.exchange_available && (
            <div className='flex items-center gap-1 flex-col'>
              <div className='w-14 h-14 rounded-full flex items-center justify-center overflow-hidden'>
                <Image
                  src={'/icons/return.png'}
                  alt='icon'
                  width={40}
                  height={40}
                />
              </div>
              <div className='text-sm font-medium capitalize text-center'>
                7 days replacement
              </div>
            </div>
          )}
          <div className='flex items-center gap-1 flex-col'>
            <div className='w-14 h-14 rounded-full flex items-center justify-center overflow-hidden'>
              <Image
                src={'/icons/makiinindia.png'}
                alt='icon'
                width={40}
                height={40}
              />
            </div>
            <div className='text-sm font-medium capitalize text-center'>
              Make In India
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className='mt-2 border-t'>
        <ProductSpecs specifications={currentProduct.specifications} />
      </div>
    </div>
  );
}
