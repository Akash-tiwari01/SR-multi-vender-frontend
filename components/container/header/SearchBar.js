'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({isMobile}) => {
  const [isOpen, setIsOpen] = useState(isMobile);
  const searchRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div 
      ref={searchRef}
      className={`relative transition-all duration-500 ease-in-out  items-center hidden md:flex ${
        isOpen ? 'w-full md:max-w-md lg:max-w-xl' : 'w-10'
      }`}
    >
      <input
        type="text"
        placeholder="Search for crafts..."
        className={`w-full py-2 px-10 rounded-full text-gray-900 bg-white focus:outline-none transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute p-2 rounded-full transition-all duration-300 ${
          isOpen 
            ? 'right-2 text-gray-400 hover:text-[var(--color-brand-primary)]' 
            : 'right-0 text-white hover:bg-white/10'
        }`}
        aria-label="Toggle Search"
        disabled={isMobile}
      >
        {isMobile?<Search size={24} />:isOpen ? <X size={20} /> : <Search size={24} />}
        {}
      </button>
    </div>
  );
};

export default SearchBar;