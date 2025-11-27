import {  ChevronsRight, XCircle } from 'lucide-react';
import ProductImage from './ProductImage';
import Image from 'next/image';

export default function ProductView({product}) {
 
  const images = product.media || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-8">
        {/* LEFT: Thumbs + Big Image (col-span 7) */}
        <ProductImage images={images}/>
        {/* RIGHT: Details (col-span 5) */}
        <div className="h-[80vh] lg:col-span-6 overflow-x-scroll scrollbar-hide">
          <h1 className="text-3xl lg:text-4xl font-serif text-rose-900 mb-2">{product?.name || "Untiteled Product"}</h1>
          {product?.vendor?.name?<div className="flex items-center gap-3 mb-6">
            <span className="text-xs text-gray-600">Sold By:</span>
            <button className="text-sm font-semibold text-rose-800">{product?.vendor?.name}</button>
          </div>:""}
          <div className='details mb-3'>
            <p className='
              line-clamp-3 
              // 2. Standard Tailwind Styles 
              text-sm 
              font-semibold 
              text-gray-800 
              leading-relaxed 
              mt-2 
              mb-1' 
              dangerouslySetInnerHTML={{ __html: product?.description }} 
              />
              <button className='flex text-rose-800 group'>Read more<ChevronsRight className='h-6 stroke-1 group-hover:ml-2 transition-all'/></button>
              </div>

          <div className="text-4xl font-bold text-rose-900 mb-6">₹{product?.sale_price}</div>

          <div>
            
          </div>
          <div className="flex gap-4 mb-6">
            <button className="flex-1 bg-rose-900 text-white py-3 rounded shadow">Add to Cart</button>
            <button className="flex-1 border border-rose-900 text-rose-900 py-3 rounded">Buy Now</button>
            <button className="w-12 h-12 border rounded flex items-center justify-center">♡</button>
          </div>

          <div className="border-t pt-6 ">
           
            <div className="flex gap-10 mt-4">
              <div className="flex items-center gap-1 flex-col">
                <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"><Image src="/icons/authenticity.png" alt='icon' width={40} height={40}/></div>
                <div><div className="text-sm font-medium capitalize text-center">100% <br/> Authentic</div></div>
              </div>

              <div className="flex items-center gap-1 flex-col">
                <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"><Image src="/icons/return.png" alt='icon' width={40} height={40}/></div>
                <div><div className="text-sm font-medium capitalize text-center">7 days <br/> replacement</div></div>
              </div>

              <div className="flex items-center gap-1 flex-col">
                <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"><Image src="/icons/cash-on-delivery.png" alt='icon' width={40} height={40}/></div>
                <div><div className="text-sm font-medium capitalize text-center">COD <br/> Available</div></div>
              </div>

              <div className="flex items-center gap-1 flex-col">
                <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"><Image src="/icons/makiinindia.png" alt='icon' width={80} height={80}/></div>
                <div><div className="text-sm font-medium capitalize text-center">Make in <br/>india</div></div>
              </div>

             
            </div>
          </div>
          

          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold">Details</h4>
            <p className="text-sm text-gray-600 mt-2">Soft, breathable handloom kurta made from premium cotton. Perfect for festive and casual wear.</p>
          </div>
        </div>
      </div>

      {/* Modal: View all images line-by-line */}
      
    </div>
  )
}


