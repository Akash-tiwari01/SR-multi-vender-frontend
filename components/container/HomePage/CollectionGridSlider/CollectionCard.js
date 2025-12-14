import { getImageUrl } from '@/utils/helperFunction';
import Link from 'next/link';
import React from 'react';

/**
 * Collection Card Component.
 */
export default function CollectionCard({ collection, gridClasses }) {
  console.log(collection);
  const { name, image, slug } = collection;
  
  const cardStyle = {
    backgroundImage: `url(${getImageUrl(image)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
        className={`relative p-6 rounded-2xl shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${gridClasses}`}
        style={cardStyle} // Background Image Implementation
      ><Link 
      href={`/collections/${slug} `}>
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-brightness-75 transition duration-300 hover:bg-black/10"></div>
        
        <div className="relative z-10 flex flex-col justify-end h-full">
          {/* Collection Name */}
          <h3 className="text-xl font-extrabold text-white leading-tight drop-shadow-lg">
            {name}
          </h3>
        </div>
        </Link>

      </div>
    
      
  );
}