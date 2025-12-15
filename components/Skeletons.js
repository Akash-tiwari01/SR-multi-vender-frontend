// components/Skeletons.js

/**
 * Why: Provides a visual cue during data fetching.
 * SOLID: Single Responsibility (Only handles loading UI).
 */
export function CollectionSkeleton() {
    return (
      <div className="animate-pulse space-y-4">
        {/* Title Skeleton */}
        <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border p-4 rounded-lg space-y-3">
              <div className="h-48 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  import { cn } from "@/utils/cn";

export default function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-10 bg-white p-6 rounded-2xl">
        
        {/* Left: Image Gallery Skeleton */}
        <div className="lg:w-2/5 space-y-4">
          <div className="flex gap-4 h-[400px]">
            {/* Vertical Thumbnails */}
            <div className="hidden lg:flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 bg-slate-200 rounded-lg" />
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 bg-slate-200 rounded-2xl" />
          </div>
          {/* Buttons Skeleton */}
          <div className="flex gap-4 mt-6">
            <div className="flex-1 h-14 bg-slate-300 rounded-xl" />
            <div className="flex-1 h-14 bg-rose-200 rounded-xl" />
          </div>
        </div>

        {/* Right: Info Skeleton */}
        <div className="lg:w-3/5 space-y-6">
          <div className="h-4 w-1/4 bg-slate-200 rounded" />
          <div className="h-10 w-3/4 bg-slate-200 rounded" />
          
          <div className="flex gap-4">
            <div className="h-8 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-24 bg-slate-200 rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
          </div>

          {/* Specs Skeleton */}
          <div className="mt-8 space-y-4">
            <div className="h-10 w-full bg-slate-50 rounded border border-slate-100" />
            <div className="h-10 w-full bg-slate-50 rounded border border-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}