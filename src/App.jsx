import { useCallback, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ErrorBoundary } from "./components/storefront/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { ErrorState } from "./components/common/ErrorState";
import {
  fetchProductsThunk,
  fetchCategoriesThunk,
  fetchOffersThunk,
  fetchPaymentMethodsThunk,
  fetchShippingRatesThunk,
  fetchFreeShippingThunk,
  fetchAnnouncementsThunk,
  fetchHeroBannersThunk,
  fetchSideCardsThunk,
  fetchSiteSettingsThunk,
} from "./store/dataSlice";
import {
  logoutUser,
  logoutAdmin,
  selectIsLoggedIn,
  fetchAddressesThunk,
  fetchProfileThunk,
} from "./store/authSlice";
import { fetchWishlistThunk } from "./store/wishlistSlice";
import { features } from "./config/features";

import { Layout } from "./components/storefront/Layout";
import { HomePage } from "./pages/storefront/HomePage";
import { ProductDetailsPage } from "./pages/storefront/ProductDetails";
import { CartPage } from "./pages/storefront/Cart";
import { WishlistPage } from "./pages/storefront/WishlistPage";
import { LoginPage } from "./pages/storefront/LoginPage";
import { UserDashboardPage } from "./pages/storefront/UserDashboard";

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

/** Public data every visitor needs before the shell can render. */
const bootstrapThunks = [
  fetchSiteSettingsThunk,
  fetchProductsThunk,
  fetchCategoriesThunk,
  fetchOffersThunk,
  fetchPaymentMethodsThunk,
  fetchShippingRatesThunk,
  fetchFreeShippingThunk,
  fetchAnnouncementsThunk,
  fetchHeroBannersThunk,
  fetchSideCardsThunk,
];

const RequireUser = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export function App() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const [bootstrap, setBootstrap] = useState({ status: "loading" });

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const handleUnauthorized = (event) => {
      dispatch(event.detail?.scope === "admin" ? logoutAdmin() : logoutUser());
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [dispatch]);

  const loadBootstrapData = useCallback(async () => {
    setBootstrap({ status: "loading" });

    const results = await Promise.all(
      bootstrapThunks.map((thunk) => dispatch(thunk())),
    );
    const failed = results.filter((result) => result.meta.requestStatus === "rejected");

    setBootstrap(
      failed.length === results.length
        ? { status: "failed", error: failed[0]?.payload }
        : { status: "ready" },
    );
  }, [dispatch]);

  useEffect(() => {
    loadBootstrapData();
  }, [loadBootstrapData]);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn || bootstrap.status !== "ready") return;
    dispatch(fetchWishlistThunk());
    if (features.savedAddresses) dispatch(fetchAddressesThunk());
    if (features.profileEdit) dispatch(fetchProfileThunk());
  }, [dispatch, isLoggedIn, bootstrap.status]);

  if (bootstrap.status === "loading") {
    return <LoadingSpinner fullScreen />;
  }

  if (bootstrap.status === "failed") {
    return (
      <ErrorState
        title={t("connectionFailedTitle")}
        message={bootstrap.error || t("connectionFailedMessage")}
        onRetry={loadBootstrapData}
        retryLabel={t("retry")}
      />
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route
                path="user-dashboard"
                element={
                  <RequireUser>
                    <UserDashboardPage />
                  </RequireUser>
                }
              />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />

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
              <Route path="announcement" element={<AdminAnnouncementPage />} />
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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
