// components/Header.js

import HeaderTop from './HeaderTop';
import HeaderNav from './HeaderNav';
import Section from '../genericContainer/Section';

const Header = () => {
  console.log("Header Mount");
  return (
   <>
    <header className="flex flex-col justify-center sticky top-0 z-50">
      <HeaderTop />
    </header>
      <HeaderNav />
    </>
  );
};

export default Header;