'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Lock, Mail, AlertCircle, Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Rate limiting: Track login attempts in localStorage
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
  count: number;
  lockedUntil?: number;
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

  useEffect(() => {
    // Check for timeout reason
    const reason = searchParams.get('reason');
    if (reason === 'timeout') {
      setError('Sesi Anda telah berakhir karena tidak aktif. Silakan login kembali.');
    }

    // Check if account is locked
    checkLockoutStatus();
  }, [searchParams]);

  useEffect(() => {
    // Update remaining time every second when locked
    if (isLocked && lockoutTimeRemaining > 0) {
      const timer = setTimeout(() => {
        const remaining = getLockoutTimeRemaining();
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutTimeRemaining(0);
        } else {
          setLockoutTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLocked, lockoutTimeRemaining]);

  function getLoginAttempts(): LoginAttempt {
    const stored = localStorage.getItem('admin_login_attempts');
    if (!stored) return { count: 0 };

    try {
      return JSON.parse(stored);
    } catch {
      return { count: 0 };
    }
  }

  function setLoginAttempts(attempts: LoginAttempt) {
    localStorage.setItem('admin_login_attempts', JSON.stringify(attempts));
  }

  function checkLockoutStatus() {
    const attempts = getLoginAttempts();

    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      setIsLocked(true);
      setLockoutTimeRemaining(attempts.lockedUntil - Date.now());
      const minutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      setError(`Terlalu banyak percobaan login gagal. Akun dikunci selama ${minutes} menit.`);
    } else if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
      // Lockout expired, reset
      setLoginAttempts({ count: 0 });
      setIsLocked(false);
    }
  }

  function getLockoutTimeRemaining(): number {
    const attempts = getLoginAttempts();
    if (!attempts.lockedUntil) return 0;
    return Math.max(0, attempts.lockedUntil - Date.now());
  }

  function recordFailedAttempt() {
    const attempts = getLoginAttempts();
    const newCount = (attempts.count || 0) + 1;

    if (newCount >= MAX_ATTEMPTS) {
      // Lock account
      const lockedUntil = Date.now() + LOCKOUT_DURATION;
      setLoginAttempts({ count: newCount, lockedUntil });
      setIsLocked(true);
      setLockoutTimeRemaining(LOCKOUT_DURATION);
      setError(`Terlalu banyak percobaan login gagal. Akun dikunci selama 15 menit.`);
    } else {
      setLoginAttempts({ count: newCount });
      setError(`Login gagal. ${MAX_ATTEMPTS - newCount} percobaan tersisa.`);
    }
  }

  function resetAttempts() {
    setLoginAttempts({ count: 0 });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Check if locked
    if (isLocked) {
      const minutes = Math.ceil(lockoutTimeRemaining / 60000);
      setError(`Akun masih dikunci. Coba lagi dalam ${minutes} menit.`);
      return;
    }

    setLoading(true);
    setError('');

    console.log('🔐 Attempting login with:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📊 Login response:', { data, error });

      if (error) {
        console.error('❌ Login error:', error);
        recordFailedAttempt();
        throw error;
      }

      if (data.user) {
        console.log('✅ Login success! User:', data.user.email);
        // Reset attempts on successful login
        resetAttempts();

        // Small delay to ensure session is saved
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 300);
      }
    } catch (error: any) {
      console.error('❌ Catch error:', error);
      // Error already set by recordFailedAttempt if called
      if (!isLocked) {
        const attempts = getLoginAttempts();
        if (attempts.count < MAX_ATTEMPTS) {
          // Error message already set by recordFailedAttempt
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-2xl">SAHARA</div>
            <span className="text-gray-800 font-bold text-2xl">MART</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Masuk untuk mengelola toko Anda</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">Login Gagal</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@saharamart.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Memproses...' : isLocked ? `Dikunci (${Math.ceil(lockoutTimeRemaining / 60000)}m)` : 'Masuk'}
            </button>

            {isLocked && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-800">Akun Dikunci</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Tunggu {Math.ceil(lockoutTimeRemaining / 60000)} menit sebelum mencoba lagi.
                  </p>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-500">Lupa password? Hubungi administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}