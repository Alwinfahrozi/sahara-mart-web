'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Beranda', shortLabel: 'Home' },
  { href: '/tentang', label: 'Tentang Kami', shortLabel: 'Tentang' },
  { href: '/katalog', label: 'Katalog Produk', shortLabel: 'Katalog' },
  { href: '/hubungi', label: 'Hubungi Kami', shortLabel: 'Hubungi' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-2 md:px-4">
        {/* Mobile: Horizontal Scrollable Menu */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 py-3 px-2 min-w-max">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                  pathname === item.href
                    ? 'bg-[#E60000] text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {item.shortLabel}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: Centered Menu */}
        <div className="hidden md:flex justify-center gap-4 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                pathname === item.href
                  ? 'bg-[#E60000] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}