import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { cn } from '@/src/utils/cn';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { totalBundleItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/products', label: t.nav.products },
    { to: '/cart', label: t.nav.cart },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-[#213B43] bg-white/95 dark:bg-[#0B1518]/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Customer Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78] rounded-md"
        >
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#123B45] dark:bg-[#267C78] text-white flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 sm:w-5 sm:h-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="hidden sm:inline font-display text-base lg:text-lg font-bold text-[#123B45] dark:text-[#ECF3F4] tracking-tight">
            {t.brand.name}
          </span>
          <span className="sm:hidden font-display text-xs font-bold text-[#123B45] dark:text-[#ECF3F4] tracking-tight truncate max-w-[96px]">
            {t.brand.shortName}
          </span>
        </Link>

        {/* Zone 2: Customer-Only Navigation Links (Desktop) */}
        <nav
          aria-label={t.nav.mainAria}
          className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap shrink-0 transition-colors py-1 border-b-2',
                  isActive
                    ? 'text-[#123B45] dark:text-[#ECF3F4] border-[#267C78] font-semibold'
                    : 'text-[#25343A]/80 dark:text-[#9AB2B8] border-transparent hover:text-[#267C78] dark:hover:text-[#ECF3F4]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Language Switcher + Theme Toggle + Cart + Mobile Menu Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div
            role="group"
            aria-label={t.nav.languageSelectorAria}
            className="inline-flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#112126] shrink-0"
          >
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              aria-pressed={language === 'ar'}
              className={cn(
                'px-2 sm:px-2.5 h-8 rounded-md text-[11px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                language === 'ar'
                  ? 'bg-[#123B45] dark:bg-[#267C78] text-white shadow-xs'
                  : 'text-[#25343A]/75 dark:text-[#9AB2B8] hover:text-[#123B45] dark:hover:text-[#ECF3F4]'
              )}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={cn(
                'px-2 sm:px-2.5 h-8 rounded-md text-[11px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                language === 'en'
                  ? 'bg-[#123B45] dark:bg-[#267C78] text-white shadow-xs'
                  : 'text-[#25343A]/75 dark:text-[#9AB2B8] hover:text-[#123B45] dark:hover:text-[#ECF3F4]'
              )}
            >
              English
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.nav.switchToLight : t.nav.switchToDark}
            title={theme === 'dark' ? t.nav.switchToLight : t.nav.switchToDark}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#112126] text-[#25343A] dark:text-[#ECF3F4] hover:border-[#267C78] transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to="/cart"
            aria-label={t.nav.cartAria(totalBundleItems)}
            className="h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-lg bg-[#123B45] dark:bg-[#267C78] hover:bg-[#194E5B] dark:hover:bg-[#2E8F8A] text-white text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.nav.cart}</span>
            <span className="font-mono-num min-w-[20px] h-5 px-1.5 rounded bg-white/15 text-xs font-semibold flex items-center justify-center">
              {totalBundleItems}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={t.nav.openMenu}
            className="md:hidden w-9 h-9 rounded-lg border border-slate-200 dark:border-[#213B43] text-[#25343A] dark:text-[#ECF3F4] flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (Customer-Only) */}
      {mobileMenuOpen && (
        <nav
          aria-label={t.nav.mobileAria}
          className="md:hidden border-t border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] px-4 py-3 flex flex-col gap-1"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#E8F4F1] dark:bg-[#172B31] text-[#123B45] dark:text-[#ECF3F4] font-semibold'
                    : 'text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#F5F7F8] dark:hover:bg-[#172B31]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
