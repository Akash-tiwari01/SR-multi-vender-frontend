// components/HeaderTop.js

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import HeaderLoginComponent from './LoginComponent';

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
        <HeaderLoginComponent/>

      </div>
    </div>
  );
};

export default HeaderTop;
