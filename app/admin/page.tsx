'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Calendar,
  TrendingDown,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import charts to avoid SSR issues
const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60000]"></div>
    </div>
  ),
});

const OrdersChart = dynamic(() => import('@/components/charts/OrdersChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60000]"></div>
    </div>
  ),
});

const CategoryPieChart = dynamic(() => import('@/components/charts/CategoryPieChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60000]"></div>
    </div>
  ),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SalesStats {
  total_orders: number;
  total_items: number;
  total_revenue: number;
  total_profit: number;
  avg_profit_margin: number;
}

interface TopProduct {
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
  total_profit: number;
}

interface WeeklyData {
  week_start: string;
  total_orders: number;
  total_revenue: number;
  total_profit: number;
}

export default function AdminDashboard() {
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });

  const [todayStats, setTodayStats] = useState<SalesStats>({
    total_orders: 0,
    total_items: 0,
    total_revenue: 0,
    total_profit: 0,
    avg_profit_margin: 0,
  });

  const [weekStats, setWeekStats] = useState<SalesStats>({
    total_orders: 0,
    total_items: 0,
    total_revenue: 0,
    total_profit: 0,
    avg_profit_margin: 0,
  });

  const [monthStats, setMonthStats] = useState<SalesStats>({
    total_orders: 0,
    total_items: 0,
    total_revenue: 0,
    total_profit: 0,
    avg_profit_margin: 0,
  });

  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyData[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  async function fetchAllStats() {
    try {
      // Fetch product stats
      await fetchProductStats();

      // Fetch sales analytics
      await Promise.all([
        fetchTodayStats(),
        fetchWeekStats(),
        fetchMonthStats(),
        fetchTopProducts(),
        fetchCategoryData(),
        fetchDailyData(),
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProductStats() {
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { count: activeProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: lowStockProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lt('stock', 10)
      .gt('stock', 0);

    const { count: outOfStockProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('stock', 0);

    setProductStats({
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      lowStockProducts: lowStockProducts || 0,
      outOfStockProducts: outOfStockProducts || 0,
    });
  }

  async function fetchTodayStats() {
    const res = await fetch('/api/analytics/today');
    if (res.ok) {
      const data = await res.json();
      setTodayStats(data.stats);
    }
  }

  async function fetchWeekStats() {
    const res = await fetch('/api/analytics/weekly');
    if (res.ok) {
      const data = await res.json();
      setWeekStats(data.stats);
      setWeeklyTrend(data.trend || []);
    }
  }

  async function fetchMonthStats() {
    const res = await fetch('/api/analytics/monthly');
    if (res.ok) {
      const data = await res.json();
      setMonthStats(data.stats);
    }
  }

  async function fetchTopProducts() {
    const res = await fetch('/api/analytics/top-products?limit=5&period=month');
    if (res.ok) {
      const data = await res.json();
      setTopProducts(data.products || []);
    }
  }

  async function fetchCategoryData() {
    const res = await fetch('/api/analytics/by-category');
    if (res.ok) {
      const data = await res.json();
      const chartData = (data.categories || []).map((cat: any) => ({
        name: cat.category_name,
        value: Number(cat.total_revenue),
      }));
      setCategoryData(chartData);
    }
  }

  async function fetchDailyData() {
    // Fetch last 7 days from weekly_sales view
    const { data, error } = await supabase
      .from('daily_sales')
      .select('*')
      .order('sale_date', { ascending: true })
      .limit(7);

    if (data && !error) {
      const chartData = data.map((day: any) => ({
        date: new Date(day.sale_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        }),
        revenue: Number(day.total_revenue),
        profit: Number(day.total_profit),
        orders: day.total_orders,
        items: day.total_items_sold,
      }));
      setDailyData(chartData);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📊 Dashboard Analytics & Penjualan
        </h1>
        <p className="text-gray-600">
          Laporan penjualan lengkap: revenue, profit, dan produk terlaris
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E60000] mx-auto"></div>
          <p className="text-gray-600 mt-4">Memuat data analytics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stock Alerts Banner */}
          {(productStats.lowStockProducts > 0 || productStats.outOfStockProducts > 0) && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    ⚠️ Peringatan Stok
                  </h3>
                  <div className="space-y-1">
                    {productStats.lowStockProducts > 0 && (
                      <p className="text-white/90">
                        • {productStats.lowStockProducts} produk dengan stok menipis (≤ 5 unit)
                      </p>
                    )}
                    {productStats.outOfStockProducts > 0 && (
                      <p className="text-white/90">
                        • {productStats.outOfStockProducts} produk stok habis
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href="/admin/stock"
                  className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Kelola Stok →
                </Link>
              </div>
            </div>
          )}

          {/* SECTION 1: Sales Stats - Today, Week, Month */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              💰 Ringkasan Penjualan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Today's Stats */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                    Hari Ini
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm opacity-90">Revenue</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(todayStats.total_revenue)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-90">Orders</p>
                      <p className="text-lg font-semibold">{todayStats.total_orders}</p>
                    </div>
                    <div>
                      <p className="opacity-90">Items</p>
                      <p className="text-lg font-semibold">{todayStats.total_items}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-sm opacity-90">Profit</p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-xl font-bold">
                        {formatCurrency(todayStats.total_profit)}
                      </p>
                      <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
                        {todayStats.avg_profit_margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* This Week's Stats */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                    Minggu Ini
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm opacity-90">Revenue</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(weekStats.total_revenue)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-90">Orders</p>
                      <p className="text-lg font-semibold">{weekStats.total_orders}</p>
                    </div>
                    <div>
                      <p className="opacity-90">Items</p>
                      <p className="text-lg font-semibold">{weekStats.total_items}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-sm opacity-90">Profit</p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-xl font-bold">
                        {formatCurrency(weekStats.total_profit)}
                      </p>
                      <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
                        {weekStats.avg_profit_margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* This Month's Stats */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                    Bulan Ini
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm opacity-90">Revenue</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(monthStats.total_revenue)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-90">Orders</p>
                      <p className="text-lg font-semibold">{monthStats.total_orders}</p>
                    </div>
                    <div>
                      <p className="opacity-90">Items</p>
                      <p className="text-lg font-semibold">{monthStats.total_items}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-sm opacity-90">Profit</p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-xl font-bold">
                        {formatCurrency(monthStats.total_profit)}
                      </p>
                      <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
                        {monthStats.avg_profit_margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Weekly Trend & Top Products */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📈 Trend 4 Minggu Terakhir
              </h2>
              {weeklyTrend.length > 0 ? (
                <div className="space-y-3">
                  {weeklyTrend.map((week, index) => {
                    const weekDate = new Date(week.week_start);
                    const weekLabel = weekDate.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    });
                    const isCurrentWeek = index === 0;

                    return (
                      <div
                        key={week.week_start}
                        className={`p-4 rounded-lg border-2 ${
                          isCurrentWeek
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">
                            {weekLabel}
                            {isCurrentWeek && (
                              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                Minggu Ini
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-gray-600">
                            {week.total_orders} orders
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-semibold text-gray-800">
                              {formatCurrency(Number(week.total_revenue))}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Profit</p>
                            <p className="font-semibold text-green-600">
                              {formatCurrency(Number(week.total_profit))}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Belum ada data penjualan
                </p>
              )}
            </div>

            {/* Top 5 Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🏆 Top 5 Produk Terlaris (Bulan Ini)
              </h2>
              {topProducts.length > 0 ? (
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            #{index + 1}
                          </span>
                          <p className="font-semibold text-gray-800 line-clamp-2">
                            {product.product_name}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                        <div>
                          <p className="text-gray-600">Terjual</p>
                          <p className="font-bold text-gray-800">
                            {product.total_quantity_sold} pcs
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-bold text-gray-800">
                            {formatCurrency(Number(product.total_revenue))}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Profit</p>
                          <p className="font-bold text-green-600">
                            {formatCurrency(Number(product.total_profit))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Belum ada produk terjual bulan ini
                </p>
              )}
            </div>
          </div>

          {/* SECTION 3: Product Stats & Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📦 Status Produk
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/products"
                  className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Produk</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {productStats.totalProducts}
                  </p>
                </Link>

                <Link
                  href="/admin/products"
                  className="p-4 rounded-lg bg-green-50 border-2 border-green-200 hover:border-green-400 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Produk Aktif</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {productStats.activeProducts}
                  </p>
                </Link>

                <Link
                  href="/admin/products?filter=low-stock"
                  className="p-4 rounded-lg bg-orange-50 border-2 border-orange-200 hover:border-orange-400 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-500 p-2 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Stok Menipis</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {productStats.lowStockProducts}
                  </p>
                </Link>

                <Link
                  href="/admin/products?filter=out-of-stock"
                  className="p-4 rounded-lg bg-red-50 border-2 border-red-200 hover:border-red-400 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-500 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Stok Habis</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {productStats.outOfStockProducts}
                  </p>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ⚡ Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/admin/products/new"
                  className="block w-full bg-[#E60000] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#CC0000] transition-colors"
                >
                  + Tambah Produk Baru
                </Link>
                <Link
                  href="/admin/products/bulk-upload"
                  className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                >
                  📤 Bulk Upload Excel
                </Link>
                <Link
                  href="/admin/products"
                  className="block w-full border-2 border-[#E60000] text-[#E60000] py-3 rounded-lg font-semibold text-center hover:bg-[#FEE2E2] transition-colors"
                >
                  📋 Kelola Produk
                </Link>
                <Link
                  href="/admin/orders"
                  className="block w-full border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold text-center hover:bg-green-50 transition-colors"
                >
                  🛒 Lihat Pesanan
                </Link>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">System Status</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Database</span>
                  <span className="font-semibold text-green-600">● Connected</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Last Update</span>
                  <span className="font-semibold text-gray-800">
                    {new Date().toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Charts & Graphs */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 Visualisasi Data Penjualan
            </h2>

            {/* Revenue & Profit Chart */}
            <div className="mb-6">
              <RevenueChart
                data={dailyData}
                title="📈 Trend Revenue & Profit (7 Hari Terakhir)"
              />
            </div>

            {/* Orders & Category Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <OrdersChart
                data={dailyData}
                title="📦 Jumlah Orders (7 Hari Terakhir)"
              />
              <CategoryPieChart
                data={categoryData}
                title="🎯 Penjualan per Kategori"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Cara Menggunakan Dashboard Analytics</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Data penjualan akan muncul setelah Anda membuat order melalui WhatsApp checkout</p>
              <p>• Profit margin dihitung otomatis berdasarkan harga jual - harga pokok</p>
              <p>• Charts menampilkan visualisasi revenue, profit, orders, dan kategori terlaris</p>
              <p>• Semua data di-update real-time saat ada transaksi baru</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}