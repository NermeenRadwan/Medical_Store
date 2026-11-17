import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Moon, ShieldCheck, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/utils/cn';

export function AdminNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success(t.adminAuth.loggedOutToast);
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-[#213B43] bg-white/95 dark:bg-[#0B1518]/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Admin Brand Zone */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-[#123B45] dark:bg-[#267C78] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="font-display text-sm sm:text-base font-bold text-[#123B45] dark:text-[#ECF3F4] block truncate">
              {t.admin.navTitle}
            </span>
            {user?.email && (
              <span className="hidden sm:block text-xs text-[#25343A]/65 dark:text-[#9AB2B8] truncate" dir="ltr">
                {user.email}
              </span>
            )}
          </div>
        </div>

        {/* Admin Actions Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            to="/"
            className="hidden sm:inline-flex h-9 sm:h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-xs sm:text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <span>{t.admin.viewStore}</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>

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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#112126] text-[#25343A] dark:text-[#ECF3F4] hover:border-[#267C78] transition-colors flex items-center justify-center cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="h-9 sm:h-10 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.adminAuth.logoutBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
