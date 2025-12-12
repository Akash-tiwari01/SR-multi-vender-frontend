// import AddtoCart from "./ProductPage/AddtoCartPage/AddToCart/page";
import CategoriesSlider from "@/components/CategoriesSlider"
import ProductsContainer from "@/components/container/product/ProductsContainer";
import HeroBanner from "@/components/container/banner/HeroBanner";
import CollectionContainer from "@/components/container/collection/CollectionContainer";
import { getInitialHomePageData } from "@/lib/data";
import CategorySliderWrapper from "@/components/container/categories/CategorySliderWrapper";
import Section from "@/components/container/genericContainer/Section";
import InfinityLoader from "@/components/InfinityLoader";
import ProductCollectionComponent from "@/components/container/HomePage/ProductCollectionComponent";
import CollectionGridComponent from "@/components/container/HomePage/CollectionGridSlider/CollectionGridComponent";
import TextComponent from "@/components/container/HomePage/TextComponent";
import SliderComponent from "@/components/container/HomePage/SliderComponent";
import GalleryComponent from "@/components/container/HomePage/GalleryComponent";
import ImageComponent from "@/components/container/HomePage/ImageComponent";
export default async function Home() {
  console.log("`````````````````````````````Homepage```````````````````````````");

  const data = await getInitialHomePageData();
  const components = await data.homepageData.homepageNew || data.homepageData.homepages
  const renderComponent = (component) => {
    switch (component.display_type) {
      case 'COLLECTION PRODUCTS':
        return (
          <ProductCollectionComponent key={component._id} {...component} />
        );
      case 'COLLECTION':
        return <CollectionGridComponent key={component?._id} {...component} />;
      case 'SLIDER':
        return <SliderComponent key={component._id} {...component} />;
      case 'GALLERY':
        return <GalleryComponent key={component._id} {...component} />;
      case 'IMAGE':
        return <ImageComponent key={component._id} {...component} />;
      case 'TEXT':
        return <TextComponent key={component._id} {...component} />;
      default:
        return null;
    }
  };
  if( components == null ) 
  return <Section className="flex items-center justify-center">
    <InfinityLoader className=""/>
  </Section>
  return (
    <div className='px-2 '> 
    <HeroBanner/>
      {
        components?.map((component)=>(
          <Section key={component._id}
            className={`homepage-component`}>
              {renderComponent(component)}
          </Section>
        ))
      }
    </div>
  );
}

