import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { CartProvider } from '@/src/context/CartContext';
import { LanguageProvider, useLanguage } from '@/src/context/LanguageContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { ProtectedAdminRoute } from '@/src/components/auth/ProtectedAdminRoute';
import { HomePage } from '@/src/pages/HomePage';
import { ProductsPage } from '@/src/pages/ProductsPage';
import { ProductDetailsPage } from '@/src/pages/ProductDetailsPage';
import { CartPage } from '@/src/pages/CartPage';
import { CheckoutPage } from '@/src/pages/CheckoutPage';
import { AdminLoginPage } from '@/src/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/src/pages/AdminDashboardPage';

function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F8] dark:bg-[#0B1518] text-[#25343A] dark:text-[#ECF3F4]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { dir, isRTL } = useLanguage();

  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER AREA (Public, No Admin Links) */}
        <Route
          path="/"
          element={
            <CustomerLayout>
              <HomePage />
            </CustomerLayout>
          }
        />
        <Route
          path="/products"
          element={
            <CustomerLayout>
              <ProductsPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <CustomerLayout>
              <ProductDetailsPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <CustomerLayout>
              <CartPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <CustomerLayout>
              <CheckoutPage />
            </CustomerLayout>
          }
        />

        {/* ADMIN AREA (Completely Separated & Role-Protected) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position={isRTL ? 'bottom-left' : 'bottom-right'}
        dir={dir}
        richColors
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
