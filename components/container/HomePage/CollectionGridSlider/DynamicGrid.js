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
    const { baseGridCols, minHeightClass } = getGridConfigurationByLength(length); 

    const gridContainerClasses = `grid ${baseGridCols} gap-4 grid-flow-row-dense auto-rows-[15rem]`;

    return (
        <div className={`container mx-auto p-2 md:p-4 ${minHeightClass}`}>
            <div className={gridContainerClasses}>
                {product_collections.map((collection, index) => {
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