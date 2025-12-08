/**
 * Defines the specific, custom Bento Grid layout for a given total length.
 * Each configuration is an array where the index corresponds to the item's index.
 * The value is the Tailwind class for that item's sizing (col-span, row-span, height).
 * * @type {Record<number, string[]>}
 */
const BENTO_LAYOUTS = {
    // Layout 3: 2x1, 1x1, 1x1. Fills a 2-column grid.
    3: [
        'col-span-2 row-span-1 h-[20rem]', // Item 0 (Large featured)
        'col-span-1 row-span-1 h-[20rem]', // Item 1
        'col-span-1 row-span-1 h-[20rem]', // Item 2
    ],
    // Layout 4: Perfect 2x2 square grid.
    4: [
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
    ],
    // Layout 5: Feature item + 4 smaller items (e.g., 2x2, 1x1, 1x1, 1x1, 1x1)
    5: [
        'col-span-2 row-span-2 h-[40rem]', // Item 0 (2x2 featured)
        'col-span-1 row-span-1 h-[20rem]', // Item 1
        'col-span-1 row-span-1 h-[20rem]', // Item 2
        'col-span-1 row-span-1 h-[20rem]', // Item 3
        'col-span-1 row-span-1 h-[20rem]', // Item 4
    ],
    // Layout 6: 3 columns, 2 rows (perfect 3x2 grid)
    6: [
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
    ],
    // Layout 8: 4 columns, 2 rows (perfect 4x2 grid)
    8: [
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
        'col-span-1 row-span-1 h-[20rem]',
    ],
};

/**
 * Retrieves the specific grid sizing class for an item based on the total 
 * collection length and the item's index.
 * * NOTE: This function supports **perfectly filling** the container for 
 * lengths defined in BENTO_LAYOUTS. For other lengths, it falls back to a 
 * general, non-bento flow.
 * * @param {number} index - The index of the current item.
 * @param {number} length - The total number of items.
 * @returns {string} Tailwind class string for item sizing.
 */
export function getBentoGridClassesByIndex(index, length) {
    // 1. Check for specific, pre-defined bento layouts
    const layout = BENTO_LAYOUTS[length];
    if (layout && index < layout.length) {
        // Returns a class that is guaranteed to fill the container for the defined lengths
        return layout[index];
    }
    
    // 2. Fallback for lengths not explicitly defined (e.g., 1, 2, 7, or > 8)
    // This allows the container's auto-flow and min/max settings to handle the layout.
    
    const isOdd = index & 1; 
    const isGroupStart = (index & 3) === 0; 
    
    if (length <= 2) {
        // For 1 or 2 items, use a simple full-width, single-row approach.
        return 'col-span-full row-span-1 h-[20rem]';
    }

    // Default Staggered/Featured Layout (for non-perfect fills like 7 or > 8)
    if (isGroupStart) {
        // Large, featured item (2x2)
        return 'col-span-2 row-span-2 h-[40rem]';
    } else if (isOdd) {
        // Normal item, tall height (1x2)
        return 'col-span-1 row-span-2 h-[40rem]';
    } else {
        // Normal item, standard height (1x1)
        return 'col-span-1 row-span-1 h-[20rem]';
    }
}