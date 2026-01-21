// services/menuService.js
export const getMenuData = async (slug) => {
    try {
      const res = await fetch(`http://localhost:5058/api/menus/slug/${slug}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return await res.json();
    } catch (error) {
      console.error("Menu Fetch Error:", error);
      return null;
    }
  };