// import AddtoCart from "./ProductPage/AddtoCartPage/AddToCart/page";
import Header from "@/components/container/header/Header";
import CategoriesSlider from "@/components/CategoriesSlider"
import ProductsContainer from "@/components/container/product/ProductsContainer";
import HeroBanner from "@/components/container/banner/HeroBanner";
import CollectionContainer from "@/components/container/collection/CollectionContainer";
import Footer from "@/components/container/footer/footer";
export default function Home() {
  return (
    <div className="header">
      <Header/>
      <HeroBanner/>
      <CategoriesSlider/>
      {/* <CollectionContainer/> */}
      <ProductsContainer/>
      <Footer/>
    </div>
  );
}

