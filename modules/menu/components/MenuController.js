// components/Menu/MenuController.jsx
import { useEffect, useState } from 'react';
import { getMenuData} from '../menuService'
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';

const MenuController = ({ slug, isMobileOpen }) => {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getMenuData(slug);
      setMenu(data);
    };
    loadData();
  }, [slug]);

  if (!menu) return null;

  return (
    <>
      <MegaMenu items={menu.items} />
      <MobileMenu items={menu.items} isOpen={isMobileOpen} />
    </>
  );
};

export default MenuController;