export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>

      {/* Category badge skeleton */}
      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>

      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

      {/* Price skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>

      {/* Stock skeleton */}
      <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>

      {/* Buttons skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
