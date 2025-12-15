import React from "react";

const ProductSpecs = ({ specifications = [] }) => {
  if (!specifications.length) return null;

  return (
    <section className="mt-10">
      

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <caption>
            <h3 className="text-base font-semibold text-slate-900 pb-4 text-left p-4">
              Specifications
            </h3>
          </caption>
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
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
          <tbody>
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
    </section>
  );
};

export default ProductSpecs;
