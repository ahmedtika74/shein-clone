import { Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { cn } from "./utils/cn";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from "./components/storefront/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchProductsThunk,
  fetchCategoriesThunk,
  fetchOrdersThunk,
} from "./store/dataSlice";

// Storefront
import { Layout } from "./components/storefront/Layout";
import { HomePage } from "./pages/storefront/HomePage";
import { ProductDetailsPage } from "./pages/storefront/ProductDetails";
import { CartPage } from "./pages/storefront/Cart";
import { WishlistPage } from "./pages/storefront/WishlistPage";
import { LoginPage } from "./pages/storefront/LoginPage";
import { UserDashboardPage } from "./pages/storefront/UserDashboard";

// Admin
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "./pages/admin/AdminProducts";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminOffersPage } from "./pages/admin/AdminOffersPage";
import { AdminHeroPage } from "./pages/admin/AdminHeroPage";
import { AdminAnnouncementPage } from "./pages/admin/AdminAnnouncementPage";
import { AdminPaymentMethodsPage } from "./pages/admin/AdminPaymentMethodsPage";
import { AdminShippingRatesPage } from "./pages/admin/AdminShippingRatesPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminReportsPage } from "./pages/admin/AdminReports";

export function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchCategoriesThunk());
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Suspense
            fallback={
              <div
                className={cn(
                  "flex h-screen items-center justify-center font-bold text-xl text-gray-400",
                )}
              >
                Loading Application...
              </div>
            }
          >
            <Routes>
              {/* Storefront Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="product/:id" element={<ProductDetailsPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="user-dashboard" element={<UserDashboardPage />} />
              </Route>

              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Dashboard Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route
                  index
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="offers" element={<AdminOffersPage />} />
                <Route path="hero" element={<AdminHeroPage />} />
                <Route
                  path="announcement"
                  element={<AdminAnnouncementPage />}
                />
                <Route
                  path="payment-methods"
                  element={<AdminPaymentMethodsPage />}
                />
                <Route
                  path="shipping-rates"
                  element={<AdminShippingRatesPage />}
                />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
              </Route>

              {/* Catch All Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
