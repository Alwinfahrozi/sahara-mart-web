'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package } from 'lucide-react';

export default function TrackingSearchPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/tracking/${orderNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E60000] rounded-2xl mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Lacak Pesanan Anda
            </h1>
            <p className="text-lg text-gray-600">
              Masukkan nomor pesanan untuk melihat status pengiriman
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSearch}>
              <div className="mb-6">
                <label htmlFor="orderNumber" className="block text-sm font-bold text-gray-700 mb-3">
                  Nomor Pesanan
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="orderNumber"
                    placeholder="Contoh: ORD-2024-001234"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-lg"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Nomor pesanan dapat ditemukan di pesan WhatsApp konfirmasi atau email Anda
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E60000] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#CC0000] transition-colors shadow-lg hover:shadow-xl"
              >
                Lacak Pesanan
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-bold text-gray-800 mb-1">Status Real-time</h3>
              <p className="text-sm text-gray-600">Pantau status pesanan kapan saja</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-bold text-gray-800 mb-1">Update Pengiriman</h3>
              <p className="text-sm text-gray-600">Lacak perjalanan paket Anda</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-bold text-gray-800 mb-1">Bantuan Cepat</h3>
              <p className="text-sm text-gray-600">Hubungi kami via WhatsApp</p>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-xl p-6 mt-8 border-2 border-blue-200">
            <h3 className="font-bold text-gray-800 mb-2">💡 Tips Lacak Pesanan</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Nomor pesanan dikirim via WhatsApp setelah checkout</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Pastikan nomor pesanan diketik dengan benar (case-sensitive)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Hubungi kami jika nomor pesanan tidak ditemukan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
