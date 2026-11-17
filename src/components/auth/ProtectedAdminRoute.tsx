import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F5F7F8] dark:bg-[#0B1518] text-[#123B45] dark:text-[#ECF3F4]">
        <Loader2 className="w-7 h-7 animate-spin text-[#267C78]" aria-hidden="true" />
        <p className="text-sm font-medium">{t.adminAuth.checkingAccess}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
