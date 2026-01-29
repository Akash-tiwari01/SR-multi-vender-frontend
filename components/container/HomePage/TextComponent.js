import Section from "../genericContainer/Section";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/helperFunction";



export default function TextComponent({ text_component, description }) {
  // Guard clause: Early return is cleaner than nested ternary operators
//   const hasContent = (text_component && text_component.length > 0) || description;
const hasContent   = false  
if (!hasContent) return null;

  return (
    <Section className="py-10 space-y-12">
      {/* Top Level Description */}
      {description && (
        <div className="store-description-main  ">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: description }} 
          />
        </div>
      )}

      {/* List of Image/Text Blocks */}
      <div className="store-description-container">
        {text_component.map((component, index) => (
          <TextContentBlock 
            key={index} 
            data={component} 
          />
        ))}
      </div>
    </Section>
  );
}


const TextContentBlock = ({ data }) => {
  // Logic is centralized here to avoid duplication in the main map function
  const renderContent = () => (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {data.image && (
        <div className="relative w-full overflow-hidden rounded-md">
          <Image
            src={getImageUrl(data.image)}
            alt="Promotion Banner"
            width={0}
            height={0}
            sizes="100vw"
            /* Using h-auto and w-full ensures the image respects its original aspect ratio */
            className="w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.01]"
            unoptimized
          />
        </div>
      )}
      
      {data.content && (
        <Section>
            <div 
          className=" store-description-container  " 
          dangerouslySetInnerHTML={{ __html: data.content }} 
        />
        </Section>
      )}
    </div>
  );

  if (data.link) {
    return (
      <Link href={data.link} className=" group no-underline">
        {renderContent()}
      </Link>
    );
  }

  return <div className="w-full">{renderContent()}</div>;
};