import Link from "next/link";
import PopularSearches from "./PopularSearches";
import { getMenuData } from "@/modules/menu/menuService";

// Utility to handle conditional linking
const SmartLink = ({ item, className }) => {
  if (item.url && item.url !== "") {
    return (
      <Link href={item.url} className={className}>
        {item.label}
      </Link>
    );
  }
  return <span className={className}>{item.label}</span>;
};

export default async function Footer() {
  const menuData = await getMenuData("footer_menu");

  if (!menuData || !menuData.items) return null;

  // Extract "Popular Searches" specifically for the top section
  const popularSearchesItem = menuData.items.find(
    (item) => item.label === "Popular Searches"
  );
  
  // Filter out Popular Searches from the main grid to avoid duplication
  const gridItems = menuData.items.filter(
    (item) => item.label !== "Popular Searches"
  );

  return (
    <div className="mt-2">
      {/* Dynamic Popular Searches */}
      {popularSearchesItem && (
        <PopularSearches items={popularSearchesItem.children} />
      )}

      {/* Main Footer Section */}
      <footer className="bg-brand-primary text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-y-10">
          {gridItems.map((column) => (
            <div key={column.id} className="space-y-4">
              <h4 className="text-xl font-bold text-brand-secondary border-b border-brand-secondary pb-2 mb-4">
                {column.label}
              </h4>
              {column.children && column.children.length > 0 && (
                <ul className="space-y-2 text-sm">
                  {column.children.map((child) => (
                    <li key={child.id}>
                      <SmartLink 
                        item={child} 
                        className="text-slate-300 hover:text-brand-secondary transition duration-300" 
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </footer>

      {/* Bottom Bar */}
      <footer className="bg-brand-secondary text-brand-primary py-4 flex items-center justify-center mb-10 md:mb-0">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-row  justify-between items-center gap-1">
          <p className="text-center md:text-left text-sm mb-3 md:mb-0">
            Copyright © 2026
            <span className="font-semibold"> SR CRAFT CREATIONS</span> all rights reserved.
          </p>
          <p className="text-center md:text-left text-sm mb-3 md:mb-0">
             Design & Developed by 
            <span className="font-semibold"> Digital Creatorss</span> .
          </p>
        </div>
      </footer>
    </div>
  );
}