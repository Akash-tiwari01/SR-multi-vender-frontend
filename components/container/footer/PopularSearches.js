export default function PopularSearches({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-brand-primary">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-semibold text-brand-secondary mb-3 border-b border-brand-secondary pb-2">
          Popular Searches
        </h2>
        <div className="flex flex-wrap items-center text-sm leading-6">
          {items.map((item, index) => (
            <span key={item.id || index} className="flex items-center py-1">
              {item.url ? (
                <Link
                  href={item.url}
                  className="text-white hover:text-brand-secondary transition duration-300 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white whitespace-nowrap">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <span className="mx-2 text-slate-400">|</span>
              )}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}