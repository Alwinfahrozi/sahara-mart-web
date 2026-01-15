import Link from 'next/link';
export { default as ProductCard } from './ProductCard';
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/produk/${product.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative aspect-square bg-gray-100">
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-[#E60000] text-white text-xs font-bold px-2 py-1 rounded-md z-10">
              -{discount}%
            </div>
          )}
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📦
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#E60000] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#E60000]">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}