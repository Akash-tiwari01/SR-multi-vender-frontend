// ... existing typedef ...

export function getGridConfigurationByLength(length) {
    let baseGridCols = 'grid-cols-1';
    let minHeightClass = 'min-h-[250px]';

    switch (length) {
        case 1:
        case 2:
            // Single column, or two cards side-by-side in a 2-column container
            baseGridCols = 'grid-cols-1 md:grid-cols-2';
            minHeightClass = 'min-h-[300px] max-w-lg mx-auto md:max-w-none md:mx-0';
            break;
        case 3:
            // Requires a 2-column grid for the [2x1, 1x1, 1x1] layout
            baseGridCols = 'grid-cols-2'; 
            minHeightClass = 'min-h-[400px]'; // Ensure a single row of 400px height
            break;
        case 4:
            // Requires a 2-column grid for the perfect 2x2 layout
            baseGridCols = 'grid-cols-2';
            minHeightClass = 'min-h-[450px]'; // For the two rows of 20rem (40rem total)
            break;
        case 5:
            // Requires a 4-column grid for the [2x2, 1x1, 1x1, 1x1, 1x1] layout
            baseGridCols = 'grid-cols-4'; 
            minHeightClass = 'min-h-[700px]'; // For the two rows of 20rem (40rem total)
            break;
        case 6:
            // Requires a 3-column grid for the perfect 3x2 layout
            baseGridCols = 'grid-cols-3';
            minHeightClass = 'min-h-[450px]'; // Two rows of 20rem (40rem total)
            break;
        case 7:
            // Use a 4-column base for a staggered look (as items fall back to general logic)
            baseGridCols = 'grid-cols-4';
            minHeightClass = 'min-h-[700px]';
            break;
        case 8:
            // Requires a 4-column grid for the perfect 4x2 layout
            baseGridCols = 'grid-cols-4';
            minHeightClass = 'min-h-[450px]'; // Two rows of 20rem (40rem total)
            break;
        default:
            // For length > 8, use the general, dense 5-column layout for the fallback item sizing
            baseGridCols = 'grid-cols-5';
            minHeightClass = 'min-h-[800px]';
            break;
    }

    return { baseGridCols, minHeightClass };
}