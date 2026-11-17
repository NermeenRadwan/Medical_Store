import { Link } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#0F1D22] mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#25343A]/75 dark:text-[#9AB2B8]">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-start">
          <span className="font-display font-bold text-[#123B45] dark:text-[#ECF3F4]">
            {t.brand.name}
          </span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>{t.footer.tagline}</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="hover:text-[#267C78] dark:hover:text-[#ECF3F4] transition-colors whitespace-nowrap"
          >
            {t.footer.store}
          </Link>
          <Link
            to="/cart"
            className="hover:text-[#267C78] dark:hover:text-[#ECF3F4] transition-colors whitespace-nowrap"
          >
            {t.footer.cart}
          </Link>
        </div>
      </div>
    </footer>
  );
}
