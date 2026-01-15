'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  DollarSign,
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_items: number;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  total_profit: number;
  profit_margin: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_subtotal: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter]);

  // Auto-refresh every 30 seconds to check for new orders
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(true); // silent refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [statusFilter]);

  async function fetchOrders(silent = false) {
    try {
      if (!silent) {
        setLoading(true);
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const newOrders = data.orders || [];
        const newTotal = data.pagination.total;

        // Check for new orders and show notification
        if (previousOrderCount > 0 && newTotal > previousOrderCount) {
          const newOrdersCount = newTotal - previousOrderCount;
          showNewOrderNotification(newOrdersCount);
        }

        setOrders(newOrders);
        setPagination(data.pagination);
        setPreviousOrderCount(newTotal);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  function showNewOrderNotification(count: number) {
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pesanan Baru! 🎉', {
        body: `Ada ${count} pesanan baru masuk`,
        icon: '/favicon.ico',
      });
    }

    // Play sound (optional - browser built-in beep)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBziO1/PMeS0GJHbH8N2RQAoUXrPp66hVFApGnt/yv24iByJ1xu/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIgcjdcXv3ZVBCxVdsujrqVUUC0ae3/K/biIHI3XF792VQQsVXbLo66lVFAtGnt/yv24iByN1xe/dlUELFV2y6OupVRQLRp7f8r9uIg==');
    audio.play().catch(() => {
      // Ignore if audio play fails
    });
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  function getStatusBadge(status: string) {
    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
      },
      processing: {
        label: 'Processing',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Package,
      },
      shipped: {
        label: 'Shipped',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: Truck,
      },
      delivered: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  }

  function getPaymentBadge(paymentStatus: string) {
    const config: Record<string, { label: string; color: string }> = {
      unpaid: { label: 'Belum Bayar', color: 'bg-gray-100 text-gray-800' },
      paid: { label: 'Lunas', color: 'bg-green-100 text-green-800' },
      refunded: { label: 'Refund', color: 'bg-orange-100 text-orange-800' },
    };

    const { label, color } = config[paymentStatus] || config.unpaid;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${color}`}>
        <DollarSign className="w-3 h-3" />
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Manajemen Pesanan</h1>
            <p className="text-gray-600">Kelola semua pesanan dari customer</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Auto-refresh setiap 30 detik</span>
          </div>
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{pagination.total}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>

        {/* Processing Orders */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Processing</p>
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter((o) => o.status === 'processing').length}
          </p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nomor order atau nama customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E60000] mx-auto"></div>
            <p className="text-gray-600 mt-4">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-600">Pesanan akan muncul di sini setelah customer checkout</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{order.order_number}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{order.total_items} items</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(order.total_profit)}
                          </p>
                          <p className="text-xs text-gray-500">{order.profit_margin.toFixed(1)}%</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4">{getPaymentBadge(order.payment_status)}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-[#E60000] hover:text-[#CC0000] font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(order.status)}
                      {getPaymentBadge(order.payment_status)}
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm">
                      <span className="text-gray-600">Customer:</span>{' '}
                      <span className="font-medium text-gray-900">{order.customer_name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Items:</span>{' '}
                      <span className="font-semibold text-gray-900">{order.total_items} items</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Total:</span>{' '}
                      <span className="font-bold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Profit:</span>{' '}
                      <span className="font-semibold text-green-600">
                        {formatCurrency(order.total_profit)} ({order.profit_margin.toFixed(1)}%)
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="block w-full text-center bg-[#E60000] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#CC0000] transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
                  {pagination.total} pesanan
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
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
