// components/Header.js

import HeaderTop from './HeaderTop';
import HeaderNav from './HeaderNav';

const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      <HeaderTop />
      <HeaderNav />
    </header>
  );
};

export default Header;