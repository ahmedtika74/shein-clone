import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "../../../components/common/SEO";
import { logoutUser } from "../../../store/authSlice";
import { useDashboardLogic } from "./useDashboardLogic";
import { DashboardSidebar } from "./DashboardSidebar";
import { OrdersTab } from "./OrdersTab";
import { ProfileTab } from "./ProfileTab";
import { CancelOrderModal } from "./CancelOrderModal";
import { RefundRequestModal } from "./RefundRequestModal";

export const UserDashboardPage = () => {
  const { t } = useTranslation(["storefront", "common"]);
  const navigate = useNavigate();
  const logic = useDashboardLogic();

  if (!logic.isLoggedIn) {
    return (
      <div className={cn("max-w-lg mx-auto py-20 px-4 text-center")}>
        <SEO title="User Dashboard" noindex={true} />
        <div
          className={cn(
            "bg-white p-8 rounded-2xl border border-gray-200 shadow-sm",
          )}
        >
          <i
            className={cn("fa-solid fa-user-lock text-5xl text-gray-400 mb-4")}
          ></i>
          <h2 className={cn("text-2xl font-bold text-gray-800")}>
            {t("loginRequired")}
          </h2>
          <p className={cn("text-gray-500 mt-2 mb-6")}>
            {t("loginRequiredMessage")}
          </p>
          <Link
            to="/login"
            className={cn(
              "inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors",
            )}
          >
            {t("goToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("dashboard flex flex-1 bg-[#f7f7f7]")}>
      <SEO title="User Dashboard" noindex={true} />

      <DashboardSidebar
        activeTab={logic.activeTab}
        setActiveTab={logic.setActiveTab}
        dispatch={logic.dispatch}
        navigate={navigate}
      />

      <main className={cn("content flex-1 p-6 md:p-10")}>
        <div className={cn("flex justify-between items-center gap-4 mb-8")}>
          <div className="min-w-0">
            <h1
              className={cn(
                "text-2xl md:text-3xl font-bold text-gray-900 capitalize truncate",
              )}
            >
              {t("hello")} {logic.user?.name || "Customer"}!
            </h1>
            <p className={cn("text-gray-500 text-sm mt-1 truncate")}>
              {logic.user?.email}
            </p>
          </div>

          <button
            onClick={() => {
              logic.dispatch(logoutUser());
              navigate("/");
            }}
            className={cn(
              "md:hidden shrink-0 bg-black text-white text-xs px-4 py-2 rounded-lg font-bold",
            )}
          >
            {t("logout")}
          </button>
        </div>

        <div className={cn("md:hidden flex gap-2 mb-6 border-b pb-3")}>
          <button
            onClick={() => logic.setActiveTab("orders")}
            className={cn(
              `px-4 py-2 text-sm rounded-lg font-bold ${
                logic.activeTab === "orders"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700"
              }`,
            )}
          >
            {t("myOrders")}
          </button>
          <button
            onClick={() => logic.setActiveTab("profile")}
            className={cn(
              `px-4 py-2 text-sm rounded-lg font-bold ${
                logic.activeTab === "profile"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700"
              }`,
            )}
          >
            {t("personalInfo")}
          </button>
        </div>

        {logic.activeTab === "orders" && <OrdersTab {...logic} />}
        {logic.activeTab === "profile" && <ProfileTab {...logic} />}
      </main>

      {logic.cancelOrderId && <CancelOrderModal {...logic} />}
      {logic.refundOrderId && <RefundRequestModal {...logic} />}
    </div>
  );
};
