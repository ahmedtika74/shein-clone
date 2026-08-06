import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
const StatCard = ({ title, value, icon, colorClass }) => (
  <div
    className={cn(
      "bg-white p-6 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between",
    )}
  >
    <div>
      <p
        className={cn(
          "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1",
        )}
      >
        {title}
      </p>
      <h3 className={cn("text-2xl font-black text-gray-900")}>{value}</h3>
    </div>
    <div
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center text-xl",
        colorClass,
      )}
    >
      <i className={cn(`fa-solid ${icon}`)}></i>
    </div>
  </div>
);

export const StatsGrid = ({ stats }) => {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
      )}
    >
      <StatCard
        title={t("totalRevenue")}
        value={`${t("egp", { ns: "common" })} ${stats.totalRevenue.toFixed(2)}`}
        icon="fa-money-bill-wave"
        colorClass="bg-green-50 text-green-600"
      />

      <StatCard
        title={t("totalOrders")}
        value={stats.totalOrders}
        icon="fa-bag-shopping"
        colorClass="bg-blue-50 text-blue-600"
      />

      <StatCard
        title={t("itemsSold")}
        value={stats.totalItemsSold}
        icon="fa-tags"
        colorClass="bg-purple-50 text-purple-600"
      />

      <StatCard
        title={t("avgOrderValue")}
        value={`${t("egp", { ns: "common" })} ${stats.averageOrderValue.toFixed(2)}`}
        icon="fa-chart-line"
        colorClass="bg-orange-50 text-orange-600"
      />

      <StatCard
        title={t("totalDiscounts")}
        value={`${t("egp", { ns: "common" })} ${stats.totalDiscounts.toFixed(2)}`}
        icon="fa-ticket"
        colorClass="bg-red-50 text-red-500"
      />

      <StatCard
        title={t("promoUsages")}
        value={stats.ordersWithDiscount}
        icon="fa-users"
        colorClass="bg-teal-50 text-teal-600"
      />

      <StatCard
        title={t("totalSales")}
        value={`${t("egp", { ns: "common" })} ${(stats.totalSales || 0).toFixed(2)}`}
        icon="fa-cash-register"
        colorClass="bg-indigo-50 text-indigo-600"
      />

      <StatCard
        title={t("totalShipping")}
        value={`${t("egp", { ns: "common" })} ${(stats.totalShipping || 0).toFixed(2)}`}
        icon="fa-truck-fast"
        colorClass="bg-yellow-50 text-yellow-600"
      />
    </div>
  );
};
