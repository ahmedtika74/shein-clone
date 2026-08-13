import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { features } from "../../../config/features";
import { getImageUrl } from "../../../utils/getImageUrl";
import { getLocalizedString } from "../../../utils/localization";

export const UserOrderCard = ({
  order,
  setCancelOrderId,
  setRefundOrderId,
}) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const currentLang = i18n.language === "ar" ? "ar-EG" : "en-US";
  const canCancel =
    order.status === "Pending" || order.status === "Processing";
  const canRefund = features.refunds && order.status === "Completed";

  const translateStatus = (status) => {
    if (!status) return t("pending");
    const keyMap = {
      Pending: "pending",
      Processing: "processing",
      Shipped: "shipped",
      Completed: "completed",
      Cancelled: "cancelled",
      "Refund Requested": "refundRequested",
      "Refund Refused": "refundRefused",
      Refunded: "returned",
    };
    return keyMap[status] ? t(keyMap[status]) : status;
  };

  const getStatusVariant = (status) => {
    if (status === "Completed") return "success";
    if (status === "Cancelled" || status === "Refund Refused") return "error";
    if (status === "Refund Requested") return "warning";
    return "default";
  };

  return (
    <div
      className={cn(
        "order-card bg-white rounded-[15px] p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100",
      )}
    >
      <div
        className={cn(
          "order-header flex justify-between items-start sm:items-center mb-4 border-b pb-3 gap-2",
        )}
      >
        <div className="min-w-0">
          <span
            className={cn(
              "font-bold text-gray-900 text-sm sm:text-base truncate block sm:inline",
            )}
          >
            {t("orderNumber")}
            <bdi>{order.id}</bdi>
          </span>
          <span
            className={cn("text-xs text-gray-400 sm:ms-3 block sm:inline")}
            dir="auto"
          >
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString(currentLang, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : order.date || t("recent")}
          </span>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {translateStatus(order.status)}
        </Badge>
      </div>

      <div className={cn("divide-y divide-gray-100")}>
        {order.items &&
          order.items.map((item, idx) => {
            const name =
              getLocalizedString(item, "name", i18n.language) ||
              item.nameEn ||
              item.name ||
              "";
            const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
            const color = item.colorName || item.color || "";
            const size = item.sizeName || item.size || "";
            return (
              <div
                key={item.productId || `item-${idx}`}
                className={cn("product-item flex items-center gap-4 py-3")}
              >
                <img
                  src={getImageUrl(item.imageUrl || item.img)}
                  alt={name}
                  className={cn("w-17.5 h-17.5 object-cover rounded-[10px]")}
                />
                <div className={cn("flex-1 min-w-0")}>
                  <h4 className={cn("font-bold text-gray-800 text-sm truncate")}>
                    {name}
                  </h4>
                  <p className={cn("text-xs text-gray-500")}>
                    {t("qty")} {item.quantity}{" "}
                    {color ? `| ${t("color")} ${color}` : ""}{" "}
                    {size ? `| ${t("size")} ${size}` : ""}
                  </p>
                </div>
                <span className={cn("font-bold text-black text-sm")}>
                  {t("egp")} {(unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
      </div>

      <div className={cn("tracking flex justify-between mt-6 gap-2")}>
        <div
          className={cn(
            `flex-1 text-center py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold ${
              order.status === "Pending" ||
              order.status === "Processing" ||
              order.status === "Completed"
                ? "bg-[#111] text-white"
                : "bg-gray-200 text-gray-500"
            }`,
          )}
        >
          {t("ordered")}
        </div>
        <div
          className={cn(
            `flex-1 text-center py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold ${
              order.status === "Shipped" || order.status === "Completed"
                ? "bg-[#111] text-white"
                : "bg-gray-200 text-gray-500"
            }`,
          )}
        >
          {t("shipped")}
        </div>
        <div
          className={cn(
            `flex-1 text-center py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold ${
              order.status === "Completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`,
          )}
        >
          {t("delivered")}
        </div>
      </div>

      <div
        className={cn(
          "mt-4 pt-3 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-3 sm:gap-0",
        )}
      >
        <div className="flex justify-between items-center sm:block gap-2">
          {canCancel && (
            <Button
              variant="danger"
              onClick={() => setCancelOrderId(order.id)}
              className="py-1 px-3 text-xs"
            >
              {t("cancelOrder")}
            </Button>
          )}
          {canRefund && (
            <Button
              onClick={() => setRefundOrderId(order.id)}
              className="py-1 px-3 text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200"
            >
              {t("requestRefund")}
            </Button>
          )}
          {order.status === "Refund Requested" && (
            <div
              className={cn(
                "text-orange-600 font-bold text-xs sm:text-sm flex flex-col",
              )}
            >
              <span>{t("refundPending")}</span>
              {order.refundRequestedAt && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  {t("requestedOn")}{" "}
                  {new Date(order.refundRequestedAt).toLocaleString(currentLang)}
                </span>
              )}
              {order.refundReason && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  {t("reason")} {order.refundReason}
                </span>
              )}
            </div>
          )}
          {order.status === "Refund Refused" && (
            <div
              className={cn(
                "text-red-600 font-bold text-xs sm:text-sm flex flex-col",
              )}
            >
              <span>{t("refundRefused")}</span>
              {order.refundRequestedAt && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  {t("requestedOn")}{" "}
                  {new Date(order.refundRequestedAt).toLocaleString(currentLang)}
                </span>
              )}
              {order.refusedAt && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  {t("refusedOn")}{" "}
                  {new Date(order.refusedAt).toLocaleString(currentLang)}
                </span>
              )}
              {order.refusalReason && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  {t("reason")} {order.refusalReason}
                </span>
              )}
            </div>
          )}
          {order.status === "Refunded" && (
            <div
              className={cn(
                "text-green-600 font-bold text-xs sm:text-sm flex flex-col",
              )}
            >
              <span>{t("returned")}</span>
              {order.refundRequestedAt && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  {t("requestedOn")}{" "}
                  {new Date(order.refundRequestedAt).toLocaleString(currentLang)}
                </span>
              )}
              {order.refundedAt && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  {t("acceptedOn")}{" "}
                  {new Date(order.refundedAt).toLocaleString(currentLang)}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto",
          )}
        >
          <span
            className={cn("font-bold text-gray-700 hidden sm:inline-block")}
          >
            {t("totalOrderAmount")}
          </span>
          <span className={cn("font-bold text-gray-700 sm:hidden")}>
            {t("total")}
          </span>
          <span className={cn("font-bold text-[#e60023] text-lg")}>
            {t("egp")} {Number(order.total || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
