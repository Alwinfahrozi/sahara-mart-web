'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, MapPin, Phone, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';  // ✅ IMPORT

export default function Header() {
  const { itemCount } = useCart();  // ✅ GET itemCount dari context
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/katalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/katalog');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#E60000] text-white px-4 py-2 rounded-lg font-bold text-xl">
              SAHARA
            </div>
            <span className="text-gray-800 font-bold text-xl">MART</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk kebutuhan sehari-hari..."
                className="w-full border-2 border-gray-300 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-[#E60000] text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E60000] text-white p-2 rounded-lg hover:bg-[#cc0000]"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Tracking & Cart Icons */}
          <div className="flex items-center gap-2">
            {/* Track Order Link */}
            <Link href="/tracking" className="hidden sm:block">
              <div className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors" title="Lacak Pesanan">
                <Package className="w-6 h-6 text-gray-700" />
              </div>
            </Link>

            {/* Cart Icon - ✅ UPDATED */}
            <Link href="/keranjang" className="relative">
              <div className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {/* ✅ Badge sekarang dynamic! */}
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E60000] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full border-2 border-gray-300 rounded-xl py-2.5 pl-4 pr-12 focus:outline-none focus:border-[#E60000] text-gray-900 placeholder:text-gray-400 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E60000] text-white p-2 rounded-lg hover:bg-[#cc0000] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}