import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
export const OrderItemsList = ({ order }) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("admin");
  return (
    <>
      <div className={cn("divide-y divide-gray-100 mb-4")}>
        {order.items &&
          order.items.map((item, idx) => (
            <div
              key={item.id || `orderitem-${idx}`}
              className={cn("flex items-center justify-between py-2.5 text-sm")}
            >
              <div className={cn("flex items-center gap-3")}>
                <img
                  src={item.img}
                  alt={item.name}
                  className={cn("w-12 h-12 object-cover rounded-md border")}
                />
                <div>
                  <p className={cn("font-bold text-gray-800")}>{item.name}</p>
                  <p className={cn("text-xs text-gray-400")}>
                    {t("qtyLabel")} {item.quantity}{" "}
                    {item.color
                      ? `${t("colorLabel")} ${typeof item.color === "object" ? item.color.name : item.color}`
                      : ""}{" "}
                    {item.size
                      ? `${t("sizeLabel")} ${typeof item.size === "object" ? item.size.name : item.size}`
                      : ""}
                  </p>
                </div>
              </div>
              <span className={cn("font-bold text-gray-900")}>
                {tCommon("egp")} {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
      </div>

      <div
        className={cn(
          "flex justify-between items-center pt-3 border-t text-sm font-bold",
        )}
      >
        <span className={cn("text-gray-600")}>
          {t("totalItems")} {order.items?.length || 0}
        </span>
        <span className={cn("text-xl text-[#e60023]")}>
          {tCommon("egp")} {order.total?.toFixed(2)}
        </span>
      </div>
    </>
  );
};
