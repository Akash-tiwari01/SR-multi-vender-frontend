// components/Menu/layouts/MegaMenu.jsx
import { ChevronDownIcon } from 'lucide-react';
import { NavLink } from './MenuUtils';

const MegaMenu = ({ items }) => {
  return (
    <nav className="hidden md:flex items-center space-x-4  w-full justify-center">
      {items.map((item,index) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div key={index} className={`group ${hasChildren ? 'static' : 'relative'}`}>
            {/* Main Level Item */}
            <NavLink 
              item={item} 
              className="flex items-center gap-1 text-[14px]  tracking-wider hover:text-brand-secondary transition cursor-pointer group"
            >
              {item.title}<ChevronDownIcon className='' size={16}/>
            </NavLink>

            {/* Mega Dropdown - Only renders if children exist */}
            {hasChildren && (
              <div 
              className="absolute left-0 top-12 w-full bg-white invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border-t border-gray-100 shadow-md"
              style={{ zIndex: 50 }} // Avoid excessive z-index; 50 is standard for nav
            >
              <div className="container mx-auto flex flex-wrap justify-start gap-x-12 gap-y-10 p-8">
                {item.children.map((category,index) => (
                  /* Using flex-basis to ensure consistent column sizing on larger screens */
                  <div key={index} className="flex-1 min-w-[200px] max-w-[250px] space-y-4">
                    {/* Category Heading */}
                    <div className="relative">
                      <NavLink 
                        item={category} 
                        className="font-bold text-gray-900 pb-2 block uppercase text-[14px] tracking-[0.15em] hover:text-brand-primary transition-colors"
                      >
                        {category.title}
                      </NavLink>
                      {/* Subtle underline accent */}
                      <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-primary/30"></span>
                    </div>
                    
                    {/* Sub-items List */}
                    {category.children?.length > 0 && (
                      <ul className="space-y-2.5">
                        {category.children.map((subItem,index) => (
                          <li key={index}>
                            <NavLink 
                              item={subItem} 
                              className="group/item flex items-center text-gray-500 hover:text-brand-primary text-[14px] transition-all duration-200"
                            >
                              {/* Modern hover effect: small dot or chevron */}
                              <span className="w-0 group-hover/item:w-2 h-[1px] bg-brand-primary mr-0 group-hover/item:mr-2 transition-all"></span>
                              {subItem.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bottom Bar for Promo/Call to Action (Optional Design Enhancement) */}
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="container mx-auto text-center text-[12px] text-gray-400 uppercase tracking-widest">
                  Free Delivery on orders over $150
                </div>
              </div>
            </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default MegaMenu;