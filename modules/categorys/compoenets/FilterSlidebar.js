"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { debounce } from '@/utils/debounce';
import { Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

// --- Constants ---
const MIN_LIMIT = 0;
const MAX_LIMIT = 5000000;
const STEP = 500;

const formatCurrency = (val) => {
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val;
};

export default function FilterSidebar({ currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Local UI States
  const [localSearch, setLocalSearch] = useState(currentFilters['search[name]'] || '');
  const [priceRange, setPriceRange] = useState({
    min: Number(currentFilters.min_price) || MIN_LIMIT,
    max: Number(currentFilters.max_price) || MAX_LIMIT
  });

  // Toggles State
  const [inStock, setInStock] = useState(currentFilters['conditional[in_stock]'] === 'true');
  const [returnAvailable, setReturnAvailable] = useState(currentFilters['conditional[return_available]'] === 'true');
  const [codAvailable, setCodAvailable] = useState(currentFilters['conditional[cod_available]'] === 'true');
  const [exchangeAvailable, setExchangeAvailable] = useState(currentFilters['conditional[exchange_available]'] === 'true');
  
  // Discount State
  const [minDiscount, setMinDiscount] = useState(currentFilters['conditional[discount_percentage][$gte]'] || '');

  // Sync state with URL (Handles external resets/back button)
  useEffect(() => {
    setLocalSearch(currentFilters['search[name]'] || '');
    setPriceRange({
      min: Number(currentFilters.min_price) || MIN_LIMIT,
      max: Number(currentFilters.max_price) || MAX_LIMIT
    });
    setInStock(currentFilters['conditional[in_stock]'] === 'true');
    setReturnAvailable(currentFilters['conditional[return_available]'] === 'true');
    setCodAvailable(currentFilters['conditional[cod_available]'] === 'true');
    setExchangeAvailable(currentFilters['conditional[exchange_available]'] === 'true');
    setMinDiscount(currentFilters['conditional[discount_percentage][$gte]'] || '');
  }, [currentFilters]);

  // 2. URL Strategy
  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([name, value]) => {
      // Don't set min/max if they equal the absolute bounds (prevents URL bloat)
      if (value && value !== MIN_LIMIT.toString() && value !== MAX_LIMIT.toString() && value !== false) {
        // Only set strings or numbers
        if (value === true) params.set(name, 'true');
        else params.set(name, value);
      } else {
        params.delete(name);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const debouncedUpdate = useMemo(() => debounce(updateUrl, 400), [updateUrl]);

  // 3. Handlers
  const handleSearchChange = (val) => {
    setLocalSearch(val);
    debouncedUpdate({ 'search[name]': val });
  };

  const handleSliderChange = (e, type) => {
    const value = Number(e.target.value);
    const newRange = { ...priceRange, [type]: value };

    if (type === 'min' && value >= priceRange.max - STEP) return;
    if (type === 'max' && value <= priceRange.min + STEP) return;

    setPriceRange(newRange);
    debouncedUpdate({ min_price: newRange.min, max_price: newRange.max });
  };

  const handleToggle = (type, checked) => {
    if (type === 'in_stock') {
      setInStock(checked);
      updateUrl({ 'conditional[in_stock]': checked ? 'true' : '' });
    } else if (type === 'return_available') {
      setReturnAvailable(checked);
      updateUrl({ 'conditional[return_available]': checked ? 'true' : '' });
    } else if (type === 'cod_available') {
      setCodAvailable(checked);
      updateUrl({ 'conditional[cod_available]': checked ? 'true' : '' });
    } else if (type === 'exchange_available') {
      setExchangeAvailable(checked);
      updateUrl({ 'conditional[exchange_available]': checked ? 'true' : '' });
    }
  };

  const handleDiscountChange = (val) => {
    setMinDiscount(val);
    updateUrl({ 'conditional[discount_percentage][$gte]': val });
  };

  return (
    <aside className="w-full max-w-[300px] bg-white h-screen sticky top-0 border-r border-slate-100 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-brand-primary" />
          <h2 className="font-bold text-slate-800 uppercase tracking-tight text-sm">Filters</h2>
        </div>
        <button 
          onClick={() => router.push(pathname)}
          className="text-[11px] px-2 py-1 font-bold text-brand-secondary hover:bg-brand-secondary/10 rounded-md transition-all flex items-center gap-1"
        >
          <RotateCcw size={12} /> RESET
        </button>
      </div>

      <div className="p-6 space-y-10 overflow-y-auto">
        {/* Search Section */}
        <section className="space-y-3">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Product Search</label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:bg-white outline-none transition-all text-sm"
              onChange={(e) => handleSearchChange(e.target.value)}
              value={localSearch}
            />
          </div>
        </section>

        {/* Price Slider Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Price Range</label>
            <span className="text-[12px] font-bold text-brand-primary py-1 px-2 bg-brand-primary/5 rounded">
              ₹{formatCurrency(priceRange.min)} — ₹{formatCurrency(priceRange.max)}
            </span>
          </div>

          <div className="relative h-6 flex items-center px-2">
            <div className="absolute left-2 right-2 h-1.5 bg-slate-200 rounded-full" />
            <div 
              className="absolute h-1.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.4)]" 
              style={{ 
                left: `${((priceRange.min - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100}%`, 
                right: `${100 - ((priceRange.max - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100}%` 
              }}
            />

            <input
              type="range"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              step={STEP}
              value={priceRange.min}
              onChange={(e) => handleSliderChange(e, 'min')}
              className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer z-20 slider-thumb"
            />
            <input
              type="range"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              step={STEP}
              value={priceRange.max}
              onChange={(e) => handleSliderChange(e, 'max')}
              className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer z-30 slider-thumb"
            />
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span className="bg-slate-50 px-2 py-1 rounded">
            <input
              type="Number"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              value={priceRange.min}
              onChange={(e) => handleSliderChange(e, 'min')}
              className="bg-slate-50 px-2 py-1 rounded w-16"
            /></span>
            <span className="border-brand-primary border-1 px-2 py-1 rounded flex items-center">₹
            <input
              type="Number"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              value={priceRange.max}
              onChange={(e) => handleSliderChange(e, 'max')}
              className="text-[12px] outline-0 w-16 pl-1"
            /></span>
          </div>
        </section>

        {/* Availability / Extra Conditions Section */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Conditions</label>
          
          {/* Switch 1: In Stock */}
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => handleToggle('in_stock', !inStock)}
          >
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">In Stock Only</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${inStock ? 'bg-brand-primary' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${inStock ? 'translate-x-5' : 'translate-x-0.5'} flex items-center justify-center`}>
                {inStock && <Check size={10} className="text-brand-primary" />}
              </div>
            </div>
          </div>

          {/* Switch 2: Return Available */}
          <div 
            className="flex items-center justify-between cursor-pointer group pt-2"
            onClick={() => handleToggle('return_available', !returnAvailable)}
          >
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Return Available</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${returnAvailable ? 'bg-brand-primary' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${returnAvailable ? 'translate-x-5' : 'translate-x-0.5'} flex items-center justify-center`}>
                {returnAvailable && <Check size={10} className="text-brand-primary" />}
              </div>
            </div>
          </div>

          {/* Switch 3: COD Available */}
          <div 
            className="flex items-center justify-between cursor-pointer group pt-2"
            onClick={() => handleToggle('cod_available', !codAvailable)}
          >
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Cash On Delivery</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${codAvailable ? 'bg-brand-primary' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${codAvailable ? 'translate-x-5' : 'translate-x-0.5'} flex items-center justify-center`}>
                {codAvailable && <Check size={10} className="text-brand-primary" />}
              </div>
            </div>
          </div>

          {/* Switch 4: Exchange Available */}
          <div 
            className="flex items-center justify-between cursor-pointer group pt-2"
            onClick={() => handleToggle('exchange_available', !exchangeAvailable)}
          >
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Exchange Available</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${exchangeAvailable ? 'bg-brand-primary' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${exchangeAvailable ? 'translate-x-5' : 'translate-x-0.5'} flex items-center justify-center`}>
                {exchangeAvailable && <Check size={10} className="text-brand-primary" />}
              </div>
            </div>
          </div>
        </section>

        {/* Discount Section */}
        <section className="space-y-4 pt-4 border-t border-slate-100 pb-10">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Discount</label>
          <div className="flex flex-col gap-3">
            {[
              { label: "Any Discount", value: "" },
              { label: "10% or more", value: "10" },
              { label: "20% or more", value: "20" },
              { label: "30% or more", value: "30" },
              { label: "50% or more", value: "50" },
            ].map((option) => (
              <label key={option.label} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="discount_percentage"
                  value={option.value}
                  checked={minDiscount === option.value}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="w-4 h-4 text-brand-primary border-slate-300 focus:ring-brand-primary"
                />
                <span className={`text-sm ${minDiscount === option.value ? 'font-bold text-brand-primary' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </section>

      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #daac47;
          border: 3px solid var(--brand-primary);
          cursor: grab;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slider-thumb::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.15);
          box-shadow: 0 0 0 8px var(--brand-primary-opacity);
        }
      `}</style>
    </aside>
  );
}