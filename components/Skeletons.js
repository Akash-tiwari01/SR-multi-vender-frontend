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