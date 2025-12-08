// components/HeaderNav.js

import Link from 'next/link';

const navLinks = [
  'Electronics', 'TVs & Appliances', 'Men', 'Women', 'Baby & Kids', 
  'Home & Furniture', 'Sports, Books & More', 'Flights', 'Offer Zone'
];

const HeaderNav = () => {
  return (
    <div className="bg-white  border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-around py-2.5 text-sm font-medium text-gray-800 overflow-x-scroll scrollbar-hide">
        {navLinks.map((link) => (
          <Link key={link} href={`/${link.toLowerCase().replace(/ /g, '-')}`}>
            <div className="flex items-center group cursor-pointer hover:text-blue-600">
              {link}
              {/* Conditional rendering of a dropdown arrow for items like 'Electronics' */}
              {link.includes('&') || ['Electronics', 'Men', 'Women'].includes(link) ? (
                // Small downward arrow SVG/Icon
                <svg className="w-3 h-3 ml-1 text-gray-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">...</svg>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HeaderNav;