// components/PopularSearches.jsx
export default function PopularSearches() {
    const items = [
      "Christmas Decoration Items",
      "Christmas Gifts",
      "Scented Candles",
      "Wall Clocks",
      "Pendulum Clocks",
      "Ganesha Water Fountains",
      "Ganesha Paintings",
      "Ganesha Idols",
      "Buddha Water Fountains",
      "Buddha Paintings",
      "Buddha Idols",
      "Key Holders",
      "Brass Diyas",
      "Table Decor",
      "Love Birds Showpieces",
      "Wall Hangings",
      "Radha Krishna Paintings",
      "Krishna Paintings",
      "Cotton Bedsheets",
      "Wall Decoration Items",
      "King Size Bedsheets",
      "Shiva Paintings",
      "Handcraft Items",
      "Wooden Clocks",
      "God Idols",
      "Ganesha Idols For Car Dashboard",
      "Floral Paintings",
      "Animal Figurines",
      "Sai Baba Paintings",
      "Tea Light Holders",
    ];
  
    return (
      // Outer div for the component's container and separating line
      <div className="bg-slate-950 border-t border-slate-200">
        {/* Container for the content, centered and padded */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header - Changed to rose color, bolder font, and slightly larger size */}
          <h2 className="text-xl font-semibold text-rose-600 mb-3">
            Popular Searches
          </h2>
          <div className="flex flex-wrap items-center text-slate-700 text-sm leading-6">
            {items.map((item, index) => (
              <span key={index} className="flex items-center py-1">
                <a
                  href="#"
                  // Link color is slate-700, hover changes to rose-400
                  className="text-slate-700 hover:text-rose-400 transition duration-300 whitespace-nowrap"
                >
                  {item}
                </a>
                {index < items.length - 1 && (
                  // Separator color changed to a softer slate
                  <span className="mx-2 text-slate-400">|</span>
                )}
              </span>
            ))}
          </div>
        </section>
      </div>
    );
  }