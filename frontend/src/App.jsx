import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ── Lazy-loaded pages ─────────────────────────────────────────
const Home        = lazy(() => import('./pages/Home'));
const Products    = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart        = lazy(() => import('./pages/Cart'));
const Checkout    = lazy(() => import('./pages/Checkout'));
const Orders      = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Wishlist    = lazy(() => import('./pages/Wishlist'));
const Profile     = lazy(() => import('./pages/Profile'));
const Login       = lazy(() => import('./pages/Login'));
const Register    = lazy(() => import('./pages/Register'));
const AdminLogin  = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts  = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders    = lazy(() => import('./pages/admin/AdminOrders'));

// ── Page loader spinner ───────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
  </div>
);

// ── Layout wrapper (Navbar + Footer) ─────────────────────────
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

// ── Admin layout (no Navbar/Footer) ──────────────────────────
const AdminLayout = ({ children }) => (
  <main>{children}</main>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                borderRadius: '0px',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: { primary: '#C9A84C', secondary: '#fff' },
              },
            }}
          />

          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* ── Public routes (with Navbar + Footer) ── */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
              <Route path="/products/:slug" element={<MainLayout><ProductDetail /></MainLayout>} />
              <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />

              {/* ── Guest only (redirect to home if logged in) ── */}
              <Route path="/login" element={
                <GuestRoute><MainLayout><Login /></MainLayout></GuestRoute>
              } />
              <Route path="/register" element={
                <GuestRoute><MainLayout><Register /></MainLayout></GuestRoute>
              } />

              {/* ── Protected routes (must be logged in) ── */}
              <Route path="/checkout" element={
                <ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>
              } />
              <Route path="/orders/:orderNumber" element={
                <ProtectedRoute><MainLayout><OrderDetail /></MainLayout></ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute><MainLayout><Wishlist /></MainLayout></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>
              } />

              {/* ── Admin routes (no Navbar/Footer) ── */}
              <Route path="/admin/login" element={
                <AdminLayout><AdminLogin /></AdminLayout>
              } />
              <Route path="/admin" element={
                <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>
              } />

              {/* ── 404 ── */}
              <Route path="*" element={
                <MainLayout>
                  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
                    <h1 className="font-display text-8xl font-bold text-obsidian/10 mb-4">404</h1>
                    <h2 className="font-display text-3xl font-semibold text-obsidian mb-3">Page Not Found</h2>
                    <p className="text-gray-400 font-body mb-8">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary text-sm !py-3 !px-10">Go Home</a>
                  </div>
                </MainLayout>
              } />

            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
