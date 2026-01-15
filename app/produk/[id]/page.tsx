'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ChevronLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';


export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const { addItem, isInCart, getItemQuantity } = useCart();  // ✅ GET dari context
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);  // ✅ ADD quantity state

  // Unwrap params
  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    }
    unwrapParams();
  }, [params]);

  // Fetch product
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }

        const json = await response.json();
        setProduct(json.data);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  // ✅ ADD: Handle quantity change
  const handleQuantityChange = (action: 'increment' | 'decrement') => {
    if (action === 'increment' && quantity < (product?.stock || 1)) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // ✅ UPDATE: Handle add to cart (REAL - no more alert!)
  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity);
    
    toast.success(`${quantity}x "${product.name}" berhasil ditambahkan ke keranjang!`);

    // Optional: Reset quantity after add
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#E60000] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-8">Produk tidak ditemukan</p>
          <Link href="/katalog" className="bg-[#E60000] text-white px-6 py-3 rounded-xl font-semibold">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#E60000]"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-9xl">📦</div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {product.categories?.icon} {product.categories?.name}
              </p>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                <div className="text-3xl font-bold text-[#E60000]">
                  Rp {product.price.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Berat:</span>
                  <span className="font-bold">{product.weight || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Stok:</span>
                  <span className={`font-bold ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                    {product.stock} pcs
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-mono text-sm">{product.sku || '-'}</span>
                </div>
              </div>

              {/* ✅ ADD: Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Jumlah
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="px-6 py-3 text-xl font-bold min-w-[60px] text-center text-gray-900">
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Max: <span className="font-bold">{product.stock} pcs</span>
                  </span>
                </div>
              </div>

              {/* ✅ Subtotal */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Subtotal</span>
                  <span className="text-2xl font-bold text-[#E60000]">
                    Rp {(product.price * quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* ✅ UPDATED: Add to Cart Button - REAL FUNCTION */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-[#E60000] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#CC0000] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-3"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </button>

              {/* ✅ Show if already in cart */}
              {inCart && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 text-center">
                  <p className="text-sm text-green-700 font-semibold">
                    ✓ {cartQuantity}x produk ini sudah ada di keranjang
                  </p>
                </div>
              )}
              
              <button
                onClick={() => {
                  const msg = `Halo, saya mau pesan:\n\n*${product.name}*\nJumlah: ${quantity} pcs\nHarga: Rp ${product.price.toLocaleString('id-ID')}\nTotal: Rp ${(product.price * quantity).toLocaleString('id-ID')}`;
                  window.open(`https://wa.me/6282267567946?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                disabled={product.stock === 0}
                className="w-full border-2 border-green-600 text-green-600 py-4 rounded-xl font-bold text-lg hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Pesan via WhatsApp
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-xl font-bold mb-4">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}