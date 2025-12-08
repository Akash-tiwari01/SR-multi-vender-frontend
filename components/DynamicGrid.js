import React from 'react';
import CollectionCard from './CollectionCard';
// Import the updated dedicated sizing utility
import { getBentoGridClassesByIndex } from '@/utils/bentoLayoutMapper'; 
// Import the updated configuration utility
import { getGridConfigurationByLength } from '@/utils/gridConfiguration'; 

/**
 * Renders collections in a dynamic, responsive Bento Grid layout.
 * It integrates separate logic for container configuration and card sizing.
 */
export default function DynamicGrid({ product_collections }) {
    const length = product_collections?.length || 0;
    
    if (length === 0) {
        return <div className="text-center p-10 text-gray-500">No collections found.</div>;
    }

    // 1. Get the base configuration (number of columns and min-height)
    const { baseGridCols, minHeightClass } = getGridConfigurationByLength(length); 

    // Combine static and dynamic Tailwind classes for the grid container
    // Key additions:
    // - grid-flow-row-dense: Allows large items to be pushed to the first available spot, 
    //   minimizing gaps when items have different row/col spans.
    // - auto-rows-[20rem]: Defines the *base* row height (320px) which our row-span-1/2 
    //   classes will multiply against. This ensures predictable item sizing.
    const gridContainerClasses = `grid ${baseGridCols} gap-4 grid-flow-row-dense auto-rows-[20rem]`;

    return (
        <div className={`container mx-auto p-4 md:p-8 ${minHeightClass}`}>
            <div className={gridContainerClasses}>
                {product_collections.map((collection, index) => {
                    // 2. Get the individual card sizing based on index AND total length
                    const gridClasses = getBentoGridClassesByIndex(index, length); 
                    
                    return (
                        <CollectionCard 
                            key={collection.collection_id} 
                            collection={collection} 
                            // Card receives the index-based sizing logic
                            gridClasses={gridClasses}
                        />
                    );
                })}
            </div>
        </div>
    );
}