"use client"
import { ChevronUp, LucideChevronDown } from "lucide-react";
import {useState} from "react";

const ProductSpecs = ({ specifications = [] , description="" }) => {
  if (!specifications.length) return null;
  const [showSpecifications, setShowSpecifications] = useState(-1)
  console.log(description);
  return (
    <div >
      <section className="border-b border-slate-900">
        <div className="overflow-hidden rounded-md  bg-white  py-2">
          <div>
            <button className="text-xl font-semibold text-slate-900  text-left  flex justify-between w-full transition-all duration-500 ease-in-out"  onClick={()=>{setShowSpecifications(showSpecifications==0?-1:0)}}> Description {showSpecifications==0?<ChevronUp/>:<LucideChevronDown/>}</button>
          </div>
          {/* Short Description */}
          <div
            className={`${showSpecifications==0?'content':'hidden'} description text-sm  text-brand-primary leading-relaxed my-4 mb-2`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </section>
      <section className="border-b border-slate-900">
        <div className="overflow-hidden rounded-md  bg-white py-2">
            <div>
              <button className="text-xl font-semibold text-slate-900  text-left  flex justify-between w-full transition-all duration-500 ease-in-out"  onClick={()=>{setShowSpecifications(showSpecifications==1?-1:1)}}> Specifications {showSpecifications==1?<ChevronUp/>:<LucideChevronDown/>}</button>
            </div>
            <div className={`${showSpecifications==1?'content':'hidden'} py-5 pr-10`}>
            <table className={` w-full border-collapse border`}>
            {/* Table Header */}
            <thead className={` w-full transition-all duration-500 ease-in-out mt-4 border`}>
              <tr className="bg-slate-200 border-b border-slate-800 w-full mt-4">
                <th
                  scope="col"
                  className="w-1/3 px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide"
                >
                  Feature
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide"
                >
                  Details
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className={`${showSpecifications==1?'content':'hidden'} w-full transition-all duration-500 ease-in-out`}>
              {specifications.map((spec, i) => (
                <tr
                  key={spec._id || i}
                  className="border-b last:border-b-0 hover:bg-slate-50/40 transition"
                >
                  <td className="w-1/3 px-5 py-4 text-sm text-slate-500 font-medium align-top">
                    {spec.label}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-800 align-top">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
        </div>
      </section>
      <section >
        <div className="overflow-hidden rounded-md  bg-white  py-2">
          <div>
            <button className="text-xl font-semibold text-slate-900  text-left  flex justify-between w-full transition-all duration-500 ease-in-out"  onClick={()=>{setShowSpecifications(showSpecifications==2?-1:2)}}> Reviews {showSpecifications==2?<ChevronUp/>:<LucideChevronDown/>}</button>
          </div>
          {/* Short Description */}
          <div
            className={`${showSpecifications==2?'content':'hidden'}  text-sm  text-brand-primary leading-relaxed mt-4 mb-2`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </section>
    </div>
    
  );
};

export default ProductSpecs;
