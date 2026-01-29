// components/HeaderNav.js (Server Component - Remove 'use client')
import { Suspense } from 'react';
import MenuController from '@/modules/menu/components/MenuController';

export default function HeaderNav() {
  return (
    <header className="relative bg-white my-2 py-4 hidden md:block">
      <div className="w-full flex items-center px-2">
        {/* We wrap the data-fetching part in Suspense to satisfy the build worker */}
        <Suspense fallback={<div className="h-10 w-full bg-gray-100 animate-pulse" />}>
          <MenuController slug="header_menu" />
        </Suspense>
      </div>
    </header>
  );
}