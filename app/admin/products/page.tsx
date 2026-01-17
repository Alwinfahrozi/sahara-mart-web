'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Filter, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import BarcodeScanner from '@/components/admin/BarcodeScanner';

// Tipe data sesuai schema database
type Product = {
  id: number;
  name: string;
  category_id: number;
  price: number;
  stock: number;
  image_url: string | null;
  sku: string | null;
  is_active: boolean;
  categories?: {
    id: number;
    name: string;
    slug: string;
  };
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 50;

  // Fetch products with server-side pagination
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Build query params for server-side filtering
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        if (selectedCategory !== 'all') {
          // Get category slug from categories array
          const category = categories.find(c => c.id === parseInt(selectedCategory));
          if (category) {
            params.append('category', category.slug);
          }
        }

        // Fetch products with pagination
        const productsRes = await fetch(`/api/products?${params.toString()}`);
        if (!productsRes.ok) throw new Error('Gagal memuat produk');
        const productsData = await productsRes.json();

        if (productsData.data) {
          setProducts(productsData.data);
        }

        if (productsData.pagination) {
          setTotalProducts(productsData.pagination.total);
          setTotalPages(productsData.pagination.totalPages);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if categories loaded (for category filter)
    if (categories.length > 0 || selectedCategory === 'all') {
      fetchData();
    }
  }, [currentPage, searchTerm, selectedCategory, categories]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesRes = await fetch('/api/categories');
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          if (categoriesData.categories) {
            setCategories(categoriesData.categories);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Delete handler (will be implemented in Step 3)
  const handleDelete = async (productId: number, productName: string) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus produk "${productName}"?\n\nProduk tidak akan benar-benar dihapus, hanya dinonaktifkan.`
    );
    
    if (confirmed) {
      toast('Fitur delete akan diimplementasikan di Step 3', {
        icon: 'ℹ️',
      });
      // TODO: Implement DELETE /api/products/[id]
    }
  };

  return (
    <div className="p-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
          <p className="text-sm text-gray-500">
            Kelola inventaris Sahara Mart ({totalProducts.toLocaleString()} produk)
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/bulk-upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload size={20} />
            Bulk Upload
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-[#E60000] hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <BarcodeScanner
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            onScan={(barcode) => {
              toast.success(`Scan berhasil: ${barcode}`);
            }}
            placeholder="Cari nama produk atau SKU"
            autoFocus={false}
          />
        </div>

        {/* Category Filter */}
        <div className="relative min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#E60000] focus:border-[#E60000] outline-none transition-all appearance-none bg-white cursor-pointer text-gray-900"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          // Loading State
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#E60000]"></div>
            <p className="mt-4 text-gray-500">Memuat data produk...</p>
          </div>
        ) : products.length === 0 ? (
          // Empty State
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">📦</div>
            {searchTerm || selectedCategory !== 'all' ? (
              <>
                <p className="font-medium">Produk tidak ditemukan</p>
                <p className="text-sm mt-2">Coba ubah filter pencarian Anda</p>
              </>
            ) : (
              <>
                <p className="font-medium">Belum ada produk</p>
                <p className="text-sm mt-2">Mulai tambahkan produk pertama Anda</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Stok</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      {/* Kolom Produk */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            {product.image_url ? (
                              <Image 
                                src={product.image_url} 
                                alt={product.name} 
                                width={40} 
                                height={40} 
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-lg">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kolom Kategori */}
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {product.categories?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Kolom Harga */}
                      <td className="px-6 py-4 font-medium">
                        Rp {product.price.toLocaleString('id-ID')}
                      </td>

                      {/* Kolom Stok */}
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          product.stock === 0 
                            ? 'text-red-600' 
                            : product.stock < 10 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>

                      {/* Kolom Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.is_active ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>

                      {/* Kolom Aksi */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Produk"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Produk"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Halaman {currentPage} dari {totalPages} • Total {totalProducts.toLocaleString()} produk
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}