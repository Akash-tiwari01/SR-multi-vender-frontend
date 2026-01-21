"use client";

import { useId } from "react";

/**
 * StarIcon
 * Deterministic & SSR-safe
 */
function StarIcon({ fill, size }) {
  const id = useId();
  const gradientId = `star-grad-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-110"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fill * 100}%`} stopColor="#FACC15" />
          <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
        </linearGradient>
      </defs>

      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${gradientId})`}
        stroke="#D1D5DB"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * ReviewStars
 */
export default function ReviewStars({
  rating = 0,
  size = 20,
  count = 0,
  showLabel = true,
}) {
  const safeRating = Math.min(Math.max(rating, 0), 5);

  const stars = Array.from({ length: 5 }, (_, i) =>
    Math.min(Math.max(safeRating - i, 0), 1)
  );

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex gap-0.5"
        role="img"
        aria-label={`Rated ${safeRating} out of 5 stars`}
      >
        {stars.map((fill, index) => (
          <StarIcon key={index} fill={fill} size={size} />
        ))}
      </div>

      {showLabel && (
        <div className="flex items-center text-sm font-medium text-gray-900">
          <span>{safeRating.toFixed(1)}</span>
          {count > 0 && (
            <>
              <span className="mx-1 text-gray-300">|</span>
              <span className="text-blue-600 hover:underline cursor-pointer">
                {count.toLocaleString()} reviews
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
