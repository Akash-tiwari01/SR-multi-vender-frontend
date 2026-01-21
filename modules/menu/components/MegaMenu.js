// components/Menu/layouts/MegaMenu.jsx
import { NavLink } from './MenuUtils';

const MegaMenu = ({ items }) => {
  return (
    <nav className="hidden md:flex items-center space-x-4  w-full justify-center">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div key={item._id} className={`group ${hasChildren ? 'static' : 'relative'}`}>
            {/* Main Level Item */}
            <NavLink 
              item={item} 
              className="flex items-center gap-1  text-md font-semibold  uppercase tracking-wider hover:text-brand-secondary transition cursor-pointer"
            >
              {item.title}
            </NavLink>

            {/* Mega Dropdown - Only renders if children exist */}
            {hasChildren && (
              <div 
                className="absolute left-0 top-full w-full bg-white   invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ zIndex: 100000000000000 }}
              >
                <div className="container mx-auto grid grid-cols-4 gap-8 p-10">
                  {item.children.map((category) => (
                    <div key={category._id} className="space-y-4">
                      <NavLink 
                        item={category} 
                        className="font-bold text-brand-primary  pb-2 block uppercase text-xs tracking-widest hover:text-brand-secondary"
                      >
                        {category.title}
                      </NavLink>
                      
                      {category.children?.length > 0 && (
                        <ul className="space-y-2">
                          {category.children.map((subItem) => (
                            <li key={subItem._id}>
                              <NavLink 
                                item={subItem} 
                                className="text-gray-500 hover:text-brand-secondary text-sm transition-colors duration-200"
                              >
                                {subItem.title}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
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