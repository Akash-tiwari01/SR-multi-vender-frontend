'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HeartPlus, ShoppingCartIcon, UserCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { syncCartFromStorage, selectCartItemCount } from '@/redux/cart/cartSlice';
import SearchBar from './SearchBar'; // Import the new component

function HeaderLoginComponent() {
  const [hover, setHover] = useState(false);
  const user = useSelector((state) => state.user);
  const cartItemCount = useSelector(selectCartItemCount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(syncCartFromStorage());
  }, [dispatch]);

  const { name } = user?.user || '';

  return (
    <div className='order-2 md:order-3 md:flex items-center justify-end space-x-6 hidden w-1/2 px-6 h-16'>
      
      {/* Search Component - Logic is now decoupled */}
      <SearchBar />

      {/* Auth & Actions */}
      <div className='flex items-center space-x-6'>
        <div
          className='flex items-center group cursor-pointer relative py-2'
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <UserCircle className='text-white' size={24} />
          <span className='ml-2 hidden lg:inline text-white'>
            {name || 'Login'}
          </span>
          
          {hover && (
            <div className='absolute top-full right-0 mt-1 z-50 animate-in fade-in slide-in-from-top-2'>
              <div className='bg-white border shadow-xl rounded-md w-56 overflow-hidden'>
                <Link href='/user/register' className='flex justify-between p-4 border-b hover:bg-stone-50'>
                  <span className='font-bold text-gray-800'>New?</span>
                  <span className='text-blue-600 font-bold'>Sign up</span>
                </Link>
                <Link href='/vendor/register' className='block p-4 hover:bg-stone-50 text-gray-800 font-medium'>
                  Become a seller
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link href='/cart' className='relative text-white hover:text-rose-100'>
          <ShoppingCartIcon size={24} />
          {cartItemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-rose-500 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* wish List  */}
        <Link href='/ViewCart' className='relative'>

        <HeartPlus className='hover:text-rose-100 text-white cursor-pointer' />

        <span className='absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full px-1'>

          0

        </span>

      </Link>
      </div>
    </div>
  );
}

export default HeaderLoginComponent;