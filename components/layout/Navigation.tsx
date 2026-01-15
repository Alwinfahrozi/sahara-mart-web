'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang Kami' },
  { href: '/katalog', label: 'Katalog Produk' },
  { href: '/hubungi', label: 'Hubungi Kami' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-4 py-4">
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