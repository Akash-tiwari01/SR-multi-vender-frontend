// components/HeaderTop.js

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, HeartPlus, Search, ShoppingCartIcon, UserCircle } from 'lucide-react';

const HeaderTop = () => {
  return (
    <div className="bg-slate-950 text-white p-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Section: Logo & Explore Plus */}
        <div className="flex items-center space-x-2">
          {/* Logo Link */}
          <Link href="/" className="flex items-center">
          <Image
            src="/image/logo/logo.png"
            alt="CraftCreation Logo"
            width={120}
            height={50}
            className="object-contain"
            priority
          />
        </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="grow max-w-xl mx-8">
          <div className="relative bg-white rounded-full">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full py-2 px-4 rounded-full text-gray-900 focus:outline-none bg-white"
            />
            {/* Search Icon */}
            <button className="absolute right-0 top-0 mt-2.5 mr-3 text-rose-600">
              {/* You'd use an SVG icon here, e.g., from Heroicons */}
              <Search/>
            </button>
          </div>
        </div>

        {/* Right Section: User Links */}
        <div className="flex items-center space-x-6 text-base font-medium">
          <Link href="/user/:id" className="flex items-center hover:text-rose-100 group">
            <UserCircle className='text-white group-hover:text-rose-100' size={24}/> <span className=' ml-2 flex items-center justify-center group'>Akash <ChevronDown size={16} className='ml-1 text-white stroke-3 group-hover:text-rose-100'/></span>
          </Link>
          <Link href="/cart" className="hover:text-gray-200">
            <div className="relative">
              <ShoppingCartIcon className="hover:text-rose-100 text-white cursor-pointer " />
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full px-1">
                0
              </span>
          </div>
          </Link>
          <div className="relative">
            <Link href="ViewCart">
              <HeartPlus className="hover:text-rose-100 text-white cursor-pointer " />
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full px-1">
                0
              </span>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;