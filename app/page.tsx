'use client';

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  TrendingUp,
  Clock,
  Award,
  ShoppingCart,
  Wheat,
  Milk,
  Cookie,
  Home,
  Salad,
  Coffee
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import toast from 'react-hot-toast';

// Data
const promos = [
  { id: 1, title: 'Belanja Cermat, Hemat Setiap Hari', subtitle: 'Produk segar dengan harga terjangkau', image: '/hero-1.jpg' },
  { id: 2, title: 'Promo Spesial Minggu Ini', subtitle: 'Diskon hingga 50% untuk produk pilihan', image: '/hero-2.jpg' },
];

const categories = [
  { id: 1, name: 'Sembako', icon: Wheat },
  { id: 2, name: 'Susu & Roti', icon: Milk },
  { id: 3, name: 'Snack', icon: Cookie },
  { id: 4, name: 'Kebutuhan Rumah', icon: Home },
  { id: 5, name: 'Sayuran & Buah', icon: Salad },
  { id: 6, name: 'Minuman', icon: Coffee },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // Auto-rotate slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured products from API
  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/products?limit=4');
        const json = await response.json();
        setFeaturedProducts(json.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProducts();
  }, []);

  const handleWhatsAppOrder = (product: any) => {
    const message = `Halo, saya tertarik dengan produk:\n\n*${product.name}*\nHarga: Rp ${product.price.toLocaleString('id-ID')}\nBerat: ${product.weight}\n\nApakah masih tersedia?`;
    window.open(`https://wa.me/6282267567946?text=${encodeURIComponent(message)}`, '_blank');
  };
  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success(`"${product.name}" berhasil ditambahkan ke keranjang!`);
  };
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promos.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length);

  return (
    <>
      {/* Hero Slider */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="relative h-[350px] sm:h-[400px] md:h-[500px]">
          {promos.map((promo, index) => (
            <div
              key={promo.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-r from-green-900 to-green-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
                <div className="container mx-auto px-4 h-full flex items-center">
                  <div className="text-white max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4 leading-tight">{promo.title}</h1>
                    <p className="text-base sm:text-xl md:text-2xl mb-6 md:mb-8">{promo.subtitle}</p>
                    <Link href="/katalog" className="inline-block bg-[#E60000] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-[#cc0000] transition-colors font-semibold text-sm sm:text-base">
                      Belanja Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full">
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-[#E60000] w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="bg-[#F3F4F6] py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">Kategori Produk</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  href="/katalog"
                  className="bg-white p-2 md:p-6 rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group text-center"
                >
                  <div className="flex justify-center mb-1 md:mb-3 text-gray-700 group-hover:text-[#E60000] transition-colors">
                    <IconComponent className="w-8 h-8 md:w-16 md:h-16 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="font-semibold text-gray-700 text-[10px] md:text-base leading-tight">{category.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Produk Pilihan</h2>
            <Link href="/katalog" className="text-[#E60000] font-semibold hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">Belum ada produk tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const discountPercent = product.original_price && product.original_price > product.price
                  ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                  : 0;

                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-8xl">📦</div>
                      )}

                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 bg-[#E60000] text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{discountPercent}%
                        </div>
                      )}

                      {/* Stock Warning */}
                      {product.stock < 10 && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Stok Terbatas
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-2">
                        {product.categories?.icon || '🏠'} {product.categories?.name || 'Kebutuhan Rumah'}
                      </p>
                      <h3 className="font-semibold text-base mb-1 line-clamp-2 min-h-[3rem] text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{product.weight}</p>

                      {/* Price */}
                      <div className="mb-4">
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-xs text-gray-400 line-through">
                            Rp {product.original_price.toLocaleString('id-ID')}
                          </p>
                        )}
                        <p className="text-xl font-bold text-[#E60000]">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      </div>

                      {/* Actions */}
<div className="flex flex-col gap-2">
  {/* Button Tambah ke Keranjang */}
  <button
    onClick={() => handleAddToCart(product)}
    className="w-full bg-[#E60000] text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#CC0000] transition-colors flex items-center justify-center gap-2"
  >
    <ShoppingCart className="w-4 h-4 flex-shrink-0" />
    <span className="hidden sm:inline">Tambah ke Keranjang</span>
    <span className="sm:hidden">+ Keranjang</span>
  </button>

  {/* Button Detail dan Pesan */}
  <div className="flex gap-2">
    <Link
      href={`/produk/${product.id}`}
      className="flex-1 border-2 border-[#E60000] text-[#E60000] py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#FEE2E2] transition-colors text-center"
    >
      Detail
    </Link>
    <button
      onClick={() => handleWhatsAppOrder(product)}
      className="flex-1 border-2 border-green-600 text-green-600 py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-green-50 transition-colors whitespace-nowrap"
    >
      <span className="hidden sm:inline">Pesan WA</span>
      <span className="sm:hidden">WA</span>
    </button>
  </div>
</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#F3F4F6] py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">Mengapa Belanja di Sahara Mart?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-[#FEE2E2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Produk Terjamin</h3>
              <p className="text-sm text-gray-600">Kualitas terbaik dengan harga terjangkau</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-[#FEE2E2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Harga Kompetitif</h3>
              <p className="text-sm text-gray-600">Promo menarik setiap minggu</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-[#FEE2E2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Layanan Ramah</h3>
              <p className="text-sm text-gray-600">Buka setiap hari 07:00 - 22:00</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-[#FEE2E2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Lokasi Strategis</h3>
              <p className="text-sm text-gray-600">Mudah dijangkau di berbagai area</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 text-gray-800">
            Kata Pelanggan Kami
          </h2>
          <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas kami. Lihat apa kata mereka tentang pengalaman berbelanja di Sahara Mart
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E60000] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-800">Budi Santoso</h4>
                  <div className="flex text-yellow-400 text-sm">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Harga sangat terjangkau dan produknya lengkap. Pelayanannya juga ramah. Pasti akan belanja lagi di sini!"
              </p>
              <p className="text-xs text-gray-400 mt-3">1 minggu yang lalu</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E60000] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-800">Siti Aminah</h4>
                  <div className="flex text-yellow-400 text-sm">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Sangat puas belanja di Sahara Mart. Produknya segar dan berkualitas. Recommended banget!"
              </p>
              <p className="text-xs text-gray-400 mt-3">2 minggu yang lalu</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E60000] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-800">Ahmad Rizki</h4>
                  <div className="flex text-yellow-400 text-sm">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Tokonya bersih dan rapi. Stafnya juga helpful banget kalau kita cari produk tertentu. Top!"
              </p>
              <p className="text-xs text-gray-400 mt-3">3 minggu yang lalu</p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-gradient-to-r from-[#E60000] to-[#cc0000] rounded-2xl p-6 md:p-12 text-white max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-center">Bagikan Pengalaman Anda</h3>
            <p className="text-center text-sm md:text-base text-white/90 mb-6">
              Sudah pernah belanja di Sahara Mart? Yuk share pengalaman Anda!
            </p>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Terima kasih atas feedback Anda! Tim kami akan segera menghubungi Anda via WhatsApp.'); }}>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama Anda"
                  required
                  className="px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="tel"
                  placeholder="Nomor WhatsApp"
                  required
                  className="px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-white/90">Rating:</span>
                <div className="flex gap-1 text-2xl">
                  <button type="button" className="hover:scale-110 transition-transform">⭐</button>
                  <button type="button" className="hover:scale-110 transition-transform">⭐</button>
                  <button type="button" className="hover:scale-110 transition-transform">⭐</button>
                  <button type="button" className="hover:scale-110 transition-transform">⭐</button>
                  <button type="button" className="hover:scale-110 transition-transform">⭐</button>
                </div>
              </div>

              <textarea
                placeholder="Ceritakan pengalaman belanja Anda di Sahara Mart..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-white text-[#E60000] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Kirim Feedback
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Location Finder */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#E60000] to-[#cc0000] rounded-2xl p-6 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Lokasi Toko Kami</h2>
                <p className="mb-6 text-white/90">
                  Hapesong Baru, Batang Toru, Tapanuli Selatan, North Sumatra 22738
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Buka setiap hari: 07:00 - 22:00 WIB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>Lokasi strategis & mudah dijangkau</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="aspect-video bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}