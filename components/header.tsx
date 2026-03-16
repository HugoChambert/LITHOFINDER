'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mountain, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  let theme = 'light';
  let toggleTheme = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (e) {
    // Theme provider not available during SSR
  }

  useEffect(() => {
    setMounted(true);

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      (async () => {
        setUser(session?.user ?? null);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-[var(--border-color)] transition-colors">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 shadow-lg group-hover:shadow-xl transition-shadow">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
              LITHOFINDER
            </span>
          </Link>

          <nav className="flex items-center space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/'
                  ? 'bg-[var(--accent)] text-white shadow-md'
                  : 'hover:bg-[var(--hover-bg)]'
              }`}
              style={pathname !== '/' ? { color: 'var(--foreground)' } : undefined}
            >
              Search Slabs
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    pathname === '/dashboard'
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'hover:bg-[var(--hover-bg)]'
                  }`}
                  style={pathname !== '/dashboard' ? { color: 'var(--foreground)' } : undefined}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                  style={{ color: 'var(--foreground)' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-[var(--hover-bg)] transition-all"
                style={{ color: 'var(--foreground)' }}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-all ml-2"
              style={{ color: 'var(--foreground)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
