import Link from 'next/link';
import { Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
          <Search className="w-12 h-12 text-[#E60000]" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Produk Tidak Ditemukan
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, produk yang Anda cari tidak tersedia atau sudah tidak aktif.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/katalog"
            className="bg-[#E60000] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#CC0000] transition-colors"
          >
            Lihat Semua Produk
          </Link>
          <Link
            href="/"
            className="border-2 border-[#E60000] text-[#E60000] px-8 py-3 rounded-xl font-semibold hover:bg-[#FEE2E2] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-8">
          Butuh bantuan?{' '}
          <a 
            href="https://wa.me/6282161173844" 
            target="_blank"
            className="text-[#E60000] font-semibold hover:underline"
          >
            Hubungi Customer Service
          </a>
        </p>
      </div>
    </div>
  );
}