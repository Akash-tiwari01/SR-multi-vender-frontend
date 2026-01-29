"use client";
import Image from "next/image";

export default function StoreDescription({ htmlContent }) {
  // 1. Extract the first image URL to use as a banner
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = htmlContent.match(imgRegex);
  const bannerImage = match ? match[1] : null;

  // 2. Remove the first image from the description to avoid duplication
  const descriptionWithoutFirstImage = htmlContent.replace(/<p>\s*<img[^>]+>\s*<\/p>/, "");

  return (
    <div className="w-full space-y-8">
      {/* Dynamic Store Banner */}
      {bannerImage && (
        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={bannerImage}
            alt="Store Banner"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
          {/* Overlay gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-primary)]/40 to-transparent" />
        </div>
      )}

      {/* Styled Content Container */}
      <section 
        className={`
          max-w-none 
          /* Tailwind Typography with Brand Overrides */
          prose prose-lg 
          prose-headings:text-[var(--color-brand-primary)] 
          prose-strong:text-[var(--color-brand-primary)]
          prose-strong:font-bold
          prose-p:text-gray-700 
          prose-li:text-gray-600
          prose-img:rounded-2xl
          /* Bullet and Number Styling */
          prose-ul:list-disc prose-ul:marker:text-[var(--color-brand-secondary)]
          prose-ol:list-decimal prose-ol:marker:text-[var(--color-brand-secondary)]
          /* Link styling */
          prose-a:text-[var(--color-brand-secondary)] prose-a:no-underline hover:prose-a:underline
        `}
      >
        <div 
          className="description-content"
          dangerouslySetInnerHTML={{ __html: descriptionWithoutFirstImage }} 
        />
      </section>

      <style jsx global>{`
        .description-content ins {
          text-decoration-color: var(--color-brand-secondary);
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
        }
        .description-content em {
          color: var(--color-brand-secondary);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}