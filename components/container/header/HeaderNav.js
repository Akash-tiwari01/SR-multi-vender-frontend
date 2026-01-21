// components/HeaderNav.js
'use client';

import { useEffect, useState } from 'react';
import MenuController from '@/modules/menu/components/MenuController';
import InfinityLoader from '@/components/InfinityLoader';

export default function HeaderNav() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="relative bg-white my-2 py-4 ">
      <div className=" w-full flex items-center px-2 ">
        {/* Modular Menu Component */}
        <MenuController slug="header_menu" isMobileOpen={isMobileOpen} />
      </div>
    </header>
  );
}
