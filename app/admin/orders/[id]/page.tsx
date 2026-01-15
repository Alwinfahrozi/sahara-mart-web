'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Save,
  Trash2,
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_notes: string;
  total_items: number;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  total_cost: number;
  total_profit: number;
  profit_margin: number;
  status: string;
  payment_status: string;
  payment_method: string;
  whatsapp_message: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  line_subtotal: number;
  line_profit: number;
  line_profit_margin: number;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    async function loadOrder() {
      const { id } = await params;
      fetchOrder(id);
    }
    loadOrder();
  }, []);

  async function fetchOrder(id: string) {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setStatus(data.order.status);
        setPaymentStatus(data.order.payment_status);
        setAdminNotes(data.order.admin_notes || '');
      } else {
        toast.error('Order tidak ditemukan');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Gagal memuat order');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOrder() {
    if (!order) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
          admin_notes: adminNotes,
        }),
      });

      if (response.ok) {
        toast.success('Order berhasil diupdate!');
        fetchOrder(order.id);
      } else {
        toast.error('Gagal update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Terjadi error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteOrder() {
    if (!order) return;

    if (!confirm(`Hapus order ${order.order_number}?`)) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Order berhasil dihapus!');
        router.push('/admin/orders');
      } else {
        toast.error('Gagal hapus order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Terjadi error');
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E60000] mx-auto"></div>
        <p className="text-gray-600 mt-4">Memuat detail order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Order tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E60000] mb-4 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Daftar Pesanan
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{order.order_number}</h1>
            <p className="text-gray-600 mt-1">Dibuat pada {formatDate(order.created_at)}</p>
          </div>
          <button
            onClick={handleDeleteOrder}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Order
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produk Dipesan
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    {item.product_sku && (
                      <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span>@{formatCurrency(item.unit_price)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(item.line_subtotal)}</p>
                    <p className="text-sm text-green-600 mt-1">
                      Profit: {formatCurrency(item.line_profit)} ({item.line_profit_margin.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Message */}
          {order.whatsapp_message && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📱 Pesan WhatsApp</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {order.whatsapp_message}
                </pre>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Customer
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-semibold text-gray-900">{order.customer_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">No. Telepon</p>
                  <a
                    href={`https://wa.me/${order.customer_phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-green-600 hover:text-green-700"
                  >
                    {order.customer_phone}
                  </a>
                </div>
              </div>
              {order.customer_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="font-medium text-gray-900">{order.customer_address}</p>
                  </div>
                </div>
              )}
              {order.customer_notes && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600 mb-1">Catatan Customer</p>
                  <p className="text-gray-900">{order.customer_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Status & Summary */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Status</h2>
            <div className="space-y-4">
              {/* Order Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Order
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Pembayaran
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900"
                >
                  <option value="unpaid">Belum Bayar</option>
                  <option value="paid">Lunas</option>
                  <option value="refunded">Refund</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan Admin
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Catatan internal..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleUpdateOrder}
                disabled={saving}
                className="w-full bg-[#E60000] text-white py-3 rounded-lg font-bold hover:bg-[#CC0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Ringkasan Order
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({order.total_items} items)</span>
                <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkir</span>
                <span className="font-semibold">{formatCurrency(order.shipping_cost)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-[#E60000] text-xl">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analisa Profit
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="opacity-90">Total Modal</span>
                <span className="font-semibold">{formatCurrency(order.total_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Total Profit</span>
                <span className="font-bold text-xl">{formatCurrency(order.total_profit)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/20">
                <span className="opacity-90">Profit Margin</span>
                <span className="font-bold text-2xl">{order.profit_margin.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dibuat</span>
                <span className="font-medium text-gray-900">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Update Terakhir</span>
                <span className="font-medium text-gray-900">{formatDate(order.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.payment_method}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
