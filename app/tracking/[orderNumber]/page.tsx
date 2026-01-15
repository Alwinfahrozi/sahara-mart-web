'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, CheckCircle, Clock, Truck, XCircle, ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';

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
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
  line_subtotal: number;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderNumber) {
      fetchOrderByNumber();
    }
  }, [orderNumber]);

  async function fetchOrderByNumber() {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?order_number=${orderNumber}`);

      if (response.ok) {
        const data = await response.json();
        if (data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          setError('Pesanan tidak ditemukan');
        }
      } else {
        setError('Gagal memuat data pesanan');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }

  function getStatusInfo(status: string) {
    const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any; description: string }> = {
      pending: {
        label: 'Menunggu Konfirmasi',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        icon: Clock,
        description: 'Pesanan Anda sedang menunggu konfirmasi dari admin',
      },
      confirmed: {
        label: 'Pesanan Dikonfirmasi',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        icon: CheckCircle,
        description: 'Pesanan Anda telah dikonfirmasi dan sedang diproses',
      },
      processing: {
        label: 'Sedang Diproses',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
        icon: Package,
        description: 'Pesanan Anda sedang disiapkan',
      },
      shipped: {
        label: 'Dalam Pengiriman',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-50',
        icon: Truck,
        description: 'Pesanan Anda sedang dalam perjalanan',
      },
      delivered: {
        label: 'Pesanan Selesai',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        icon: CheckCircle,
        description: 'Pesanan telah sampai di tujuan',
      },
      cancelled: {
        label: 'Pesanan Dibatalkan',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        icon: XCircle,
        description: 'Pesanan telah dibatalkan',
      },
    };

    return statusConfig[status] || statusConfig.pending;
  }

  function getPaymentStatusBadge(paymentStatus: string) {
    const config: Record<string, { label: string; color: string }> = {
      unpaid: { label: 'Belum Bayar', color: 'bg-gray-100 text-gray-800' },
      paid: { label: 'Lunas', color: 'bg-green-100 text-green-800' },
      refunded: { label: 'Refund', color: 'bg-orange-100 text-orange-800' },
    };

    const { label, color } = config[paymentStatus] || config.unpaid;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        {label}
      </span>
    );
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#E60000] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data pesanan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-sm">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {error || 'Pesanan Tidak Ditemukan'}
              </h1>
              <p className="text-gray-600 mb-8">
                Nomor pesanan yang Anda cari tidak ditemukan. Pastikan nomor pesanan sudah benar.
              </p>
              <Link
                href="/"
                className="inline-block bg-[#E60000] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#CC0000] transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#E60000] mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Order #{order.order_number}
              </h1>
              <p className="text-sm text-gray-600">
                Dibuat pada {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex gap-2">
              {getPaymentStatusBadge(order.payment_status)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Status Pesanan</h2>

              <div className={`${statusInfo.bgColor} rounded-xl p-6 border-2 border-${statusInfo.color.replace('text-', '')}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                    <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </h3>
                    <p className="text-gray-700 mt-1">{statusInfo.description}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-6 space-y-4">
                  <div className={`flex items-start gap-3 ${['delivered', 'cancelled', 'shipped', 'processing', 'confirmed', 'pending'].includes(order.status) ? 'opacity-100' : 'opacity-30'}`}>
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">Pesanan Dibuat</p>
                      <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 ${['delivered', 'cancelled', 'shipped', 'processing', 'confirmed'].includes(order.status) ? 'opacity-100' : 'opacity-30'}`}>
                    <CheckCircle className={`w-5 h-5 mt-1 ${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-semibold text-gray-800">Pesanan Dikonfirmasi</p>
                      <p className="text-sm text-gray-600">Menunggu konfirmasi admin</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 ${['delivered', 'shipped', 'processing'].includes(order.status) ? 'opacity-100' : 'opacity-30'}`}>
                    <Package className={`w-5 h-5 mt-1 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-semibold text-gray-800">Sedang Diproses</p>
                      <p className="text-sm text-gray-600">Pesanan sedang disiapkan</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 ${['delivered', 'shipped'].includes(order.status) ? 'opacity-100' : 'opacity-30'}`}>
                    <Truck className={`w-5 h-5 mt-1 ${['shipped', 'delivered'].includes(order.status) ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-semibold text-gray-800">Dalam Pengiriman</p>
                      <p className="text-sm text-gray-600">Pesanan sedang dikirim</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 ${order.status === 'delivered' ? 'opacity-100' : 'opacity-30'}`}>
                    <CheckCircle className={`w-5 h-5 mt-1 ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-semibold text-gray-800">Pesanan Selesai</p>
                      <p className="text-sm text-gray-600">Pesanan telah sampai</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Detail Produk</h2>

              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.product_image_url ? (
                        <img
                          src={item.product_image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{item.product_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                      <p className="text-lg font-bold text-[#E60000]">
                        {formatCurrency(item.line_subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Informasi Pembeli</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Nama</p>
                  <p className="font-semibold text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">No. WhatsApp</p>
                  <p className="font-semibold text-gray-900">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Alamat Pengiriman</p>
                  <p className="font-semibold text-gray-900">{order.customer_address}</p>
                </div>
                {order.customer_notes && (
                  <div>
                    <p className="text-gray-600 mb-1">Catatan</p>
                    <p className="font-semibold text-gray-900">{order.customer_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({order.total_items} items)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-semibold text-gray-900">
                    {order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : 'Belum dihitung'}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-base">Total</span>
                  <span className="text-xl font-bold text-[#E60000]">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-gray-600 text-sm mb-2">Metode Pembayaran</p>
                <div className="flex items-center gap-2">
                  {order.payment_method === 'whatsapp' && (
                    <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
                      💬 WhatsApp
                    </span>
                  )}
                  {order.payment_method === 'transfer' && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
                      🏦 Transfer Bank
                    </span>
                  )}
                  {order.payment_method === 'cash' && (
                    <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
                      💵 Cash
                    </span>
                  )}
                  {order.payment_method === 'cod' && (
                    <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
                      📦 COD (Bayar di Tempat)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-[#E60000] to-[#cc0000] rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-white/90 mb-4">
                Hubungi kami via WhatsApp untuk pertanyaan seputar pesanan Anda
              </p>
              <a
                href={`https://wa.me/6282267567946?text=${encodeURIComponent(`Halo, saya ingin menanyakan pesanan #${order.order_number}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-[#E60000] px-4 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
