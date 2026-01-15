'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Upload,
  Home
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkUser();

    // Set up auto-logout after 1 hour of inactivity
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleAutoLogout();
      }, 60 * 60 * 1000); // 1 hour = 3600000ms
    };

    // Reset timer on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start initial timer

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  // Recheck auth every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      recheckAuth();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [pathname]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setUser(user);
    }
    setLoading(false);
  }

  async function recheckAuth() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && pathname !== '/admin/login') {
      handleAutoLogout();
    }
  }

  async function handleAutoLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login?reason=timeout');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  // Don't render layout for login page
  if (pathname === '/admin/login') {
    return (
      <html lang="id">
        <body className={`${poppins.variable} font-sans antialiased`}>
          <Toaster position="top-right" />
          {children}
        </body>
      </html>
    );
  }

  if (loading) {
    return (
      <html lang="id">
        <body className={`${poppins.variable} font-sans antialiased`}>
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#E60000] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (!user) {
    return (
      <html lang="id">
        <body className={`${poppins.variable} font-sans antialiased`}>
          <Toaster position="top-right" />
          {children}
        </body>
      </html>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produk', href: '/admin/products' },
    { icon: Upload, label: 'Bulk Upload', href: '/admin/products/bulk-upload' },
    { icon: ShoppingCart, label: 'Pesanan', href: '/admin/orders' },
  ];

  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50">
          {/* ⚠️ ADMIN MODE BANNER - Always visible */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 px-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30 flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider">🔒 Admin Mode</span>
                </div>
                <span className="text-sm hidden md:inline font-medium">
                  Anda sedang di halaman admin - Tidak dapat berbelanja
                </span>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline bg-white/10 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/20"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Kembali ke Toko</span>
                <span className="sm:hidden">Toko</span>
              </Link>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="bg-[#E60000] text-white px-3 py-1 rounded font-bold">SAHARA</div>
              <span className="font-bold text-gray-800">ADMIN</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <aside className={`
              fixed lg:static inset-y-0 left-0 z-40
              w-64 bg-white border-r shadow-lg transform transition-transform duration-300
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              {/* Admin Badge Header */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-white text-red-600 px-3 py-1 rounded font-bold text-lg">SAHARA</div>
                  <span className="font-bold text-white text-lg">ADMIN</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-white/80">Logged in as:</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
              </div>

              <nav className="p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                  Menu Admin
                </p>
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all
                            ${isActive
                              ? 'bg-[#E60000] text-white shadow-md scale-105'
                              : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 w-full transition-colors border border-red-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8 bg-gray-50">
              {/* Content wrapper */}
              <div className="mb-4">
                {children}
              </div>

              {/* Admin Footer Info */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Admin Panel Active</span>
                  </div>
                  <span className="hidden sm:inline">Sahara Mart Admin Dashboard v1.0</span>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
