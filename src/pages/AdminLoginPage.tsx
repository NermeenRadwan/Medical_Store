import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Database,
  Lock,
  Moon,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useTheme } from '@/src/context/ThemeContext';
import { isSupabaseConfigured } from '@/src/lib/supabase';
import { cn } from '@/src/utils/cn';

export function AdminLoginPage() {
  const { isAdmin, loading: authLoading, signInAsAdmin } = useAuth();
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  if (!authLoading && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const res = await signInAsAdmin(email, password);
    setSubmitting(false);

    if (!res.ok) {
      if (res.reason === 'not_admin') {
        setErrorMsg(t.adminAuth.notAdminError);
      } else if (res.reason === 'not_configured') {
        setErrorMsg(t.adminAuth.supabaseMissingDesc);
      } else {
        setErrorMsg(t.adminAuth.invalidCredentialsError);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F8] dark:bg-[#0B1518] text-[#25343A] dark:text-[#ECF3F4]">
      {/* Separate Minimal Admin Auth Header */}
      <header className="border-b border-slate-200/80 dark:border-[#213B43] bg-white/95 dark:bg-[#0B1518]/95">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-[#123B45] dark:bg-[#267C78] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="font-display text-sm sm:text-base font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.admin.navTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label={t.nav.languageSelectorAria}
              className="inline-flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#112126]"
            >
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                aria-pressed={language === 'ar'}
                className={cn(
                  'px-2.5 h-8 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  language === 'ar'
                    ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                    : 'text-[#25343A]/75 dark:text-[#9AB2B8]'
                )}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={cn(
                  'px-2.5 h-8 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  language === 'en'
                    ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                    : 'text-[#25343A]/75 dark:text-[#9AB2B8]'
                )}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.nav.switchToLight : t.nav.switchToDark}
              className="w-9 h-9 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#112126] flex items-center justify-center cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-7 sm:p-9 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-[#267C78] dark:text-[#63C2BC]">
              {t.adminAuth.areaBadge}
            </p>
            <h1 className="font-display text-2xl font-bold text-[#123B45] dark:text-[#ECF3F4] mt-1">
              {t.adminAuth.loginTitle}
            </h1>
            <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1.5">
              {t.adminAuth.loginSubtitle}
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="rounded-xl bg-[#F5F7F8] dark:bg-[#0B1518] border border-slate-200 dark:border-[#213B43] p-5 text-center space-y-2">
              <Database className="w-6 h-6 text-[#267C78] mx-auto" aria-hidden="true" />
              <h2 className="font-display text-base font-bold text-[#123B45] dark:text-[#ECF3F4]">
                {t.adminAuth.supabaseMissingTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#25343A]/80 dark:text-[#9AB2B8] leading-relaxed">
                {t.adminAuth.supabaseMissingDesc}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3.5 flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] mb-1.5"
                >
                  {t.adminAuth.emailLabel}
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.adminAuth.emailPlaceholder}
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm text-[#25343A] dark:text-[#ECF3F4] focus:outline-none focus:border-[#267C78] focus:ring-1 focus:ring-[#267C78]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] mb-1.5"
                >
                  {t.adminAuth.passwordLabel}
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.adminAuth.passwordPlaceholder}
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm text-[#25343A] dark:text-[#ECF3F4] focus:outline-none focus:border-[#267C78] focus:ring-1 focus:ring-[#267C78]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-[#123B45] dark:bg-[#267C78] hover:opacity-95 disabled:opacity-60 text-white text-sm font-semibold transition-opacity cursor-pointer"
              >
                {submitting ? t.adminAuth.signingInBtn : t.adminAuth.signInBtn}
              </button>

              <div className="rounded-xl bg-[#E8F4F1]/60 dark:bg-[#172B31] p-3.5 text-xs text-[#25343A]/80 dark:text-[#9AB2B8] space-y-1">
                <p className="font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                  {t.adminAuth.firstAdminHintTitle}
                </p>
                <p>{t.adminAuth.firstAdminHintBody}</p>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#1D353C] text-center">
            <Link
              to="/"
              className="text-sm font-medium text-[#267C78] dark:text-[#63C2BC] hover:underline inline-flex items-center gap-1.5"
            >
              <BackArrow className="w-4 h-4" aria-hidden="true" />
              <span>{t.adminAuth.backToStorefront}</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
