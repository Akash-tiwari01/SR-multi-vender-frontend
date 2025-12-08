// components/Header.js

import HeaderTop from './HeaderTop';
import HeaderNav from './HeaderNav';
import Section from '../genericContainer/Section';

const Header = () => {
  return (
   <>
    <header className="sticky top-0 z-50">
      <HeaderTop />
    </header>
      <div className='px-2'>
      <Section>
      <HeaderNav />
      </Section>
      </div>
    </>
  );
};

export default Header;