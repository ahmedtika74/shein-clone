import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";

export const OrderFilters = ({
  filterStatus,
  handleFilterChange,
  totalOrders,
}) => {
  const { t } = useTranslation("admin");
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4",
      )}
    >
      <h1 className={cn("text-3xl font-bold text-gray-900")}>
        {t("manageCustomerOrders")}
      </h1>

      <div className={cn("flex items-center gap-2")}>
        <span className={cn("text-xs font-bold text-gray-500 uppercase")}>
          {t("filterStatusLabel")}
        </span>
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className={cn(
            "h-10 px-4 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-[#e60023]",
          )}
        >
          <option value="ALL">{t("allOrders", { count: totalOrders })}</option>
          <option value="Pending">
            {t("pending", { defaultValue: "Pending" })}
          </option>
          <option value="Processing">{t("processing")}</option>
          <option value="Shipped">{t("shipped")}</option>
          <option value="Completed">{t("completed")}</option>
          <option value="Cancelled">{t("cancelled")}</option>
          <option value="Refund Requested">{t("refundRequested")}</option>
          <option value="Refunded">{t("refunded")}</option>
          <option value="Refund Refused">{t("refundRefused")}</option>
        </select>
      </div>
    </div>
  );
};
