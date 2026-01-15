import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#E60000] text-white px-3 py-1.5 rounded-lg">
                <span className="font-bold">SAHARA</span>
              </div>
              <span className="font-bold text-lg">MART</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Minimarket modern yang mengutamakan kemudahan belanja dengan produk berkualitas dan harga terjangkau.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tentang" className="text-gray-300 hover:text-[#E60000] transition-colors">Tentang Kami</Link></li>
              <li><Link href="/katalog" className="text-gray-300 hover:text-[#E60000] transition-colors">Katalog Produk</Link></li>
              <li><Link href="/hubungi" className="text-gray-300 hover:text-[#E60000] transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-[#E60000] transition-colors">FAQ</Link></li>
              <li><Link href="/tracking" className="text-gray-300 hover:text-[#E60000] transition-colors">Lacak Pesanan</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold mb-4">Kebijakan</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-300 hover:text-[#E60000] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-[#E60000] transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-[#E60000] transition-colors">Bantuan</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E60000]" />
                <span className="text-gray-300">Hapesong Baru, Batang Toru, Tapanuli Selatan, North Sumatra 22738</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#E60000]" />
                <span className="text-gray-300">+62 822-6756-7946</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#E60000]" />
                <span className="text-gray-300">saharamart12@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Operating Hours */}
          <div>
            <h3 className="font-bold mb-4">Ikuti Kami</h3>
            <div className="flex gap-3 mb-6">
              <a href="https://facebook.com/saharamart" target="_blank" rel="noopener noreferrer" className="bg-[#E60000] p-2 rounded-lg hover:bg-[#cc0000] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/saharamart" target="_blank" rel="noopener noreferrer" className="bg-[#E60000] p-2 rounded-lg hover:bg-[#cc0000] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/saharamart" target="_blank" rel="noopener noreferrer" className="bg-[#E60000] p-2 rounded-lg hover:bg-[#cc0000] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Jam Operasional</h4>
              <p className="text-gray-300 text-sm">Senin - Minggu</p>
              <p className="text-gray-300 text-sm">07:00 - 22:00 WIB</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; 2024 Sahara Mart. All rights reserved. | Tumbuh Bersama Masyarakat
            </p>
            {/* Admin Login Button - Subtle */}
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors group"
              title="Staff Login"
            >
              <Lock className="w-3 h-3 group-hover:text-[#E60000] transition-colors" />
              <span className="group-hover:text-[#E60000] transition-colors">Staff Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}