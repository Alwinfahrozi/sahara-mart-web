'use client';


import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ListFilter,
  MessageCircle,
  Clock,
  Search,
  ShieldCheck,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

function CatalogPageContent() {
  const searchParams = useSearchParams();

  // State untuk filter
  const [selectedCategory, setSelectedCategory] = useState('Semua Produk');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Semua Harga');
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk data dari API
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 24; // Show 24 products per page
  const { addItem } = useCart();

  // Read search query from URL on mount
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      setCategoriesLoading(true);
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const json = await response.json();
          setCategories(json.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriceRange, searchQuery]);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');

      try {
        // Build query params
        const params = new URLSearchParams();

        // CRITICAL: Add pagination
        params.append('page', currentPage.toString());
        params.append('limit', productsPerPage.toString());

        // Category filter
        if (selectedCategory !== 'Semua Produk') {
          const categoryObj = categories.find(cat => cat.name === selectedCategory);
          if (categoryObj) {
            params.append('category', categoryObj.slug);
          }
        }

        // Search filter
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        // Price range filter
        if (selectedPriceRange !== 'Semua Harga') {
          if (selectedPriceRange === 'Di bawah Rp 25.000') {
            params.append('maxPrice', '25000');
          } else if (selectedPriceRange === 'Rp 25.000 - Rp 50.000') {
            params.append('minPrice', '25000');
            params.append('maxPrice', '50000');
          } else if (selectedPriceRange === 'Rp 50.000 - Rp 100.000') {
            params.append('minPrice', '50000');
            params.append('maxPrice', '100000');
          } else if (selectedPriceRange === 'Di atas Rp 100.000') {
            params.append('minPrice', '100000');
          }
        }
        
        // Fetch from API
        const response = await fetch(`/api/products?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Gagal memuat produk');
        }
        
        const json = await response.json();
        setProducts(json.data || []);

        // Update pagination info
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
          setTotalProducts(json.pagination.total);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Terjadi kesalahan saat memuat produk');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, selectedPriceRange, searchQuery, currentPage]);

  const handleWhatsAppOrder = (product: any) => {
    const message = `Halo, saya tertarik dengan produk:\n\n*${product.name}*\nHarga: Rp ${product.price.toLocaleString('id-ID')}\nBerat: ${product.weight || 'N/A'}\n\nApakah masih tersedia?`;
    window.open(`https://wa.me/6282267567946?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success(`"${product.name}" berhasil ditambahkan ke keranjang!`);
  };

  return (
    <div className="bg-white min-h-screen font-['Poppins'] text-[#374151]">
      
      {/* 1. Header Banner */}
      <section className="bg-[#E60000] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            {searchQuery ? `Hasil pencarian: "${searchQuery}"` : 'Katalog Produk'}
          </h1>
          <p className="text-white/90 text-base">
            {searchQuery
              ? `Menampilkan ${products.length} produk yang ditemukan`
              : 'Temukan kebutuhan sehari-hari Anda di sini'}
          </p>
        </div>
      </section>

      {/* 2. Layanan Pesan Antar */}
      <section className="bg-[#F3F4F6] py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-extrabold mb-8 text-[#1F2937] text-center">
              Layanan Pesan Antar Sahara
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="bg-[#FEE2E2] p-3 rounded-xl flex-shrink-0">
                  <ListFilter className="w-6 h-6 text-[#E60000]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2 text-[#1F2937]">1. Pilih Produk</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    Pilih produk yang Anda inginkan dari katalog kami
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="bg-[#FEE2E2] p-3 rounded-xl flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#E60000]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2 text-[#1F2937]">2. Pesan via WhatsApp</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    Kirim pesanan langsung ke CS kami
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="bg-[#FEE2E2] p-3 rounded-xl flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#E60000]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2 text-[#1F2937]">3. Terima Pesanan</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    Pesanan diantar dalam 1-2 jam*
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] text-center mt-6">
              *Berlaku untuk area tertentu. Gratis ongkir minimal belanja Rp 100.000
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Catalog Section */}
      <section className="bg-[#F3F4F6] pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filter */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <ListFilter className="w-5 h-5 text-[#E60000]" />
                  <h3 className="font-bold text-[#1F2937]">Filter Produk</h3>
                </div>

                {/* Kategori */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">Kategori</h4>
                  {categoriesLoading ? (
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory('Semua Produk')}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          selectedCategory === 'Semua Produk'
                            ? 'bg-[#E60000] text-white'
                            : 'hover:bg-[#F3F4F6] text-[#374151]'
                        }`}
                      >
                        Semua Produk
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                            selectedCategory === cat.name
                              ? 'bg-[#E60000] text-white'
                              : 'hover:bg-[#F3F4F6] text-[#374151]'
                          }`}
                        >
                          <span className="text-base">{cat.icon}</span> {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rentang Harga */}
                <div className="pt-6 border-t border-[#E5E7EB]">
                  <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">Rentang Harga</h4>
                  <div className="space-y-2">
                    {[
                      'Semua Harga',
                      'Di bawah Rp 25.000',
                      'Rp 25.000 - Rp 50.000',
                      'Rp 50.000 - Rp 100.000',
                      'Di atas Rp 100.000',
                    ].map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${
                          selectedPriceRange === range
                            ? 'bg-[#E60000] text-white font-semibold'
                            : 'hover:bg-[#F3F4F6] text-[#374151]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-[#E60000]">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-semibold">Produk 100% Original</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Header dengan counter dan search */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6B7280]">
                    Menampilkan <span className="text-[#1F2937] font-bold">{products.length}</span> produk
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('Semua Produk');
                      setSelectedPriceRange('Semua Harga');
                      setSearchQuery('');
                    }}
                    className="text-sm text-[#E60000] font-semibold hover:underline lg:hidden"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E60000] mb-4"></div>
                    <p className="text-lg text-gray-600">Memuat produk...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2">Terjadi Kesalahan</h3>
                  <p className="text-sm text-[#6B7280] mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-[#E60000] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#CC0000] transition-colors"
                  >
                    Muat Ulang
                  </button>
                </div>
              )}

              {/* Loading Skeleton */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Product Grid */}
              {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const discountPercent = product.original_price && product.original_price > product.price
                      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                      : 0;

                    return (
                      <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        {/* Product Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          {discountPercent > 0 && (
                            <div className="absolute top-3 left-3 bg-[#E60000] text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
                              -{discountPercent}%
                            </div>
                          )}
                          {product.stock < 10 && (
                            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                              Stok Terbatas
                            </div>
                          )}
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl">
                              📦
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-4">
                          {/* Category Tag */}
                          <p className="text-xs text-[#9CA3AF] mb-2 font-medium">
                            {product.categories?.icon || '🏠'} {product.categories?.name || 'Kebutuhan Rumah'}
                          </p>
                          
                          {/* Product Name */}
                          <h4 className="font-semibold text-base text-[#1F2937] mb-1 line-clamp-2 h-12">
                            {product.name}
                          </h4>
                          
                          {/* Weight */}
                          <p className="text-sm text-[#6B7280] mb-3">{product.weight || 'N/A'}</p>
                          
                          {/* Price Section */}
                          <div className="mb-4">
                            {product.original_price && product.original_price > product.price && (
                              <p className="text-xs text-[#9CA3AF] line-through mb-1">
                                Rp {product.original_price.toLocaleString('id-ID')}
                              </p>
                            )}
                            <p className="text-[#E60000] font-bold text-xl">
                              Rp {product.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {/* Button Tambah ke Keranjang */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-[#E60000] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#CC0000] transition-colors flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Tambah ke Keranjang
                            </button>
                            
                            {/* Button Detail dan Pesan */}
                            <div className="flex gap-2">
                              <Link
                                href={`/produk/${product.id}`}
                                className="flex-1 bg-white border-2 border-[#E60000] text-[#E60000] py-2 rounded-xl text-sm font-bold hover:bg-[#FEE2E2] transition-colors text-center"
                              >
                                Detail
                              </Link>
                              <button 
                                onClick={() => handleWhatsAppOrder(product)}
                                className="flex-1 border-2 border-green-600 text-green-600 py-2 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors"
                              >
                                Pesan WA
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && products.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ← Sebelumnya
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-lg font-semibold ${
                            currentPage === pageNum
                              ? 'bg-[#E60000] text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Selanjutnya →
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && products.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FEE2E2] rounded-full mb-4">
                    <Search className="w-8 h-8 text-[#E60000]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                    {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Produk tidak ditemukan'}
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">
                    {searchQuery
                      ? 'Coba kata kunci lain atau hapus filter yang aktif'
                      : 'Coba ubah kata kunci pencarian atau filter kategori'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua Produk');
                      setSelectedPriceRange('Semua Harga');
                      setCurrentPage(1);
                      window.history.pushState({}, '', '/katalog');
                    }}
                    className="bg-[#E60000] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#CC0000] transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <CatalogPageContent />
    </Suspense>
  );
}