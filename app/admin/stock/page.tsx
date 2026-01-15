'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle, TrendingUp, History, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  image_url?: string;
  categories?: {
    name: string;
    icon: string;
  };
}

interface StockLog {
  id: string;
  type: string;
  quantity_before: number;
  quantity_change: number;
  quantity_after: number;
  reason: string;
  notes?: string;
  created_at: string;
  products: {
    name: string;
    sku: string;
  };
}

export default function StockManagementPage() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [recentLogs, setRecentLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      // Fetch notifications
      const notifRes = await fetch('/api/stock/notifications');
      const notifData = await notifRes.json();

      if (notifData.success) {
        setLowStockProducts(notifData.data.lowStockProducts);
        setOutOfStockProducts(notifData.data.outOfStockProducts);
      }

      // Fetch recent logs
      const logsRes = await fetch('/api/stock/logs?limit=10');
      const logsData = await logsRes.json();

      if (logsData.success) {
        setRecentLogs(logsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data stok');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStock() {
    if (!selectedProduct || !quantityToAdd || !reason) {
      toast.error('Mohon isi semua field yang wajib');
      return;
    }

    const qty = parseInt(quantityToAdd);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Jumlah harus berupa angka positif');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/stock/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantityToAdd: qty,
          reason,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setShowAddModal(false);
        setSelectedProduct(null);
        setQuantityToAdd('');
        setReason('');
        setNotes('');
        fetchData(); // Refresh data
      } else {
        toast.error(data.message || 'Gagal menambah stok');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Terjadi kesalahan saat menambah stok');
    } finally {
      setSubmitting(false);
    }
  }

  const totalCritical = lowStockProducts.length + outOfStockProducts.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E60000] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data stok...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Stok</h1>
          <p className="text-gray-600 mt-1">Kelola stok produk dan lihat riwayat perubahan</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{lowStockProducts.length}</span>
          </div>
          <h3 className="font-semibold">Stok Menipis</h3>
          <p className="text-sm text-white/80">Produk dengan stok ≤ 5</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{outOfStockProducts.length}</span>
          </div>
          <h3 className="font-semibold">Stok Habis</h3>
          <p className="text-sm text-white/80">Produk tanpa stok</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{totalCritical}</span>
          </div>
          <h3 className="font-semibold">Total Kritis</h3>
          <p className="text-sm text-white/80">Perlu perhatian segera</p>
        </div>
      </div>

      {/* Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-200">
          <div className="px-6 py-4 border-b border-orange-200 bg-orange-50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Produk Stok Menipis ({lowStockProducts.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">
                          Stok: {product.stock}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowAddModal(true);
                          }}
                          className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Out of Stock Products */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-red-200">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              Produk Stok Habis ({outOfStockProducts.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outOfStockProducts.map((product) => (
                <div key={product.id} className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-red-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg opacity-50" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-red-600">
                          Habis
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowAddModal(true);
                          }}
                          className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Restock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Logs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            Riwayat Perubahan Stok Terbaru
          </h2>
        </div>
        <div className="p-6">
          {recentLogs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada riwayat perubahan stok</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    log.type === 'addition' ? 'bg-green-100 text-green-600' :
                    log.type === 'reduction' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {log.quantity_change > 0 ? <TrendingUp className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{log.products.name}</h4>
                        <p className="text-sm text-gray-600">
                          {log.quantity_before} → {log.quantity_after} units
                          <span className={`ml-2 font-semibold ${log.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({log.quantity_change > 0 ? '+' : ''}{log.quantity_change})
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{log.reason}</p>
                        {log.notes && <p className="text-xs text-gray-400 mt-1">Note: {log.notes}</p>}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(log.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Tambah Stok</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
              <p className="text-sm font-semibold text-gray-800 mt-2">
                Stok Sekarang: {selectedProduct.stock} units
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jumlah yang Ditambah <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent"
                  placeholder="Masukkan jumlah"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alasan <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent"
                >
                  <option value="">Pilih alasan</option>
                  <option value="Restock bulanan">Restock bulanan</option>
                  <option value="Restock mingguan">Restock mingguan</option>
                  <option value="Pembelian supplier">Pembelian supplier</option>
                  <option value="Koreksi stok">Koreksi stok</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent resize-none"
                  placeholder="Tambahkan catatan jika perlu"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddStock}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-[#E60000] text-white rounded-lg hover:bg-[#cc0000] transition-colors font-semibold disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
