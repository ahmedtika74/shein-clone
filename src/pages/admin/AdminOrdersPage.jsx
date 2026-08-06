import { cn } from "../../utils/cn";
import { OrderFilters } from "./AdminOrders/OrderFilters";
import { OrdersTable } from "./AdminOrders/OrdersTable";
import { useOrdersLogic } from "./AdminOrders/useOrdersLogic";
import { useTranslation } from "react-i18next";

export const AdminOrdersPage = () => {
  const { t } = useTranslation("admin");
  const logic = useOrdersLogic();

  return (
    <div>
      <OrderFilters
        filterStatus={logic.filterStatus}
        handleFilterChange={logic.handleFilterChange}
        totalOrders={logic.orders.length}
      />

      {logic.filteredOrders.length === 0 ? (
        <div
          className={cn(
            "bg-white p-12 rounded-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center text-gray-500",
          )}
        >
          <i
            className={cn(
              "fa-solid fa-cart-flatbed text-5xl text-gray-300 mb-3 block",
            )}
          ></i>
          {t("noOrdersFoundStatus")}
        </div>
      ) : (
        <OrdersTable {...logic} />
      )}
    </div>
  );
};
