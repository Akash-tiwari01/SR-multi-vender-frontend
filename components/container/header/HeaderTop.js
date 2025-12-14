// components/HeaderTop.js

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, HeartPlus, Search, ShoppingCartIcon, UserCircle } from 'lucide-react';

const HeaderTop = () => {
  return (
    <div className="bg-slate-950 text-white p-3 shadow-md rounded-b-md">
      <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4">

        {/* Left: Logo */}
        <div className="order-1 flex items-center space-x-2">
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

        {/* Center: Search Bar */}
        <div className="order-3 md:order-2 w-full md:max-w-xl md:flex-1 md:mx-6">
          <div className="relative bg-white rounded-full">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full py-2 px-4 rounded-full text-gray-900 focus:outline-none"
            />
            <button className="absolute right-0 top-0 mt-2.5 mr-3 text-rose-600">
              <Search />
            </button>
          </div>
        </div>

        {/* Right: User / Cart / Wishlist */}
        <div className="order-2 md:order-3 flex items-center space-x-6">
          <Link href="/user/:id" className="flex items-center hover:text-rose-100 group">
            <UserCircle className="text-white group-hover:text-rose-100" size={24} />
            <span className="ml-2 hidden sm:flex items-center group">
              Akash
              <ChevronDown size={16} className="ml-1 group-hover:text-rose-100" />
            </span>
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="hover:text-rose-100 text-white cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full px-1">0</span>
          </Link>

          <Link href="/ViewCart" className="relative">
            <HeartPlus className="hover:text-rose-100 text-white cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full px-1">0</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HeaderTop;
