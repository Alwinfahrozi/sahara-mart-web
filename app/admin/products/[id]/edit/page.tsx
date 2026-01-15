'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  category_id: number;
  price: number;
  original_price: number | null;
  stock: number;
  weight: string;
  sku: string | null;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    original_price: '',
    stock: '',
    weight: '',
    sku: '',
    description: '',
    image_url: '',
    is_featured: false,
    is_active: true,
  });

  // Unwrap params (Next.js 15+)
  useEffect(() => {
    async function unwrapParams() {
      const resolved = await params;
      setProductId(resolved.id);
    }
    unwrapParams();
  }, [params]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const json = await response.json();
        setCategories(json.categories || json.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch product data
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || 'Product not found');
        }

        const product: Product = json.data;

        // Populate form
        setFormData({
          name: product.name,
          category_id: product.category_id.toString(),
          price: product.price.toString(),
          original_price: product.original_price?.toString() || '',
          stock: product.stock.toString(),
          weight: product.weight,
          sku: product.sku || '',
          description: product.description || '',
          image_url: product.image_url || '',
          is_featured: product.is_featured,
          is_active: product.is_active,
        });

      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Convert string inputs to numbers
      const payload = {
        name: formData.name,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock),
        weight: formData.weight,
        sku: formData.sku || null,
        description: formData.description || '',
        image_url: formData.image_url || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      console.log('Submitting product update:', payload);

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product');
      }

      // Success - redirect to products list
      toast.success('Produk berhasil diperbarui!');
      router.push('/admin/products');

    } catch (err: any) {
      setError(err.message);
      toast.error(`Gagal update produk: ${err.message}`);
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus produk "${formData.name}"?\n\nProduk tidak akan benar-benar dihapus, hanya dinonaktifkan.`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete product');
      }

      toast.success('Produk berhasil dinonaktifkan!');
      router.push('/admin/products');

    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-[#E60000]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E60000] mb-4 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Daftar Produk
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Produk</h1>
        <p className="text-gray-600 mt-2">Perbarui informasi produk</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nama Produk */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none text-gray-900 placeholder:text-gray-400"
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SKU (Kode Produk)
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga Jual <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Harga Asli */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga Asli (Opsional)
            </label>
            <input
              type="number"
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Stok */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stok <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Berat */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Berat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Deskripsi */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none resize-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Gambar Produk */}
          <div className="md:col-span-2">
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
              onImageRemove={() => setFormData({ ...formData, image_url: '' })}
            />
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 text-[#E60000] border-gray-300 rounded focus:ring-[#E60000]"
              />
              <span className="text-sm font-semibold text-gray-700">
                Produk Unggulan (tampil di homepage)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-[#E60000] border-gray-300 rounded focus:ring-[#E60000]"
              />
              <span className="text-sm font-semibold text-gray-700">
                Produk Aktif (tampil di katalog)
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            Hapus Produk
          </button>

          <div className="flex gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#E60000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#CC0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
