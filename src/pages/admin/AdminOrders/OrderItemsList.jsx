import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "../../../utils/localization";
import { getImageUrl } from "../../../utils/getImageUrl";

export const OrderItemsList = ({ order }) => {
  const { t: tCommon } = useTranslation("common");
  const { t, i18n } = useTranslation("admin");

  return (
    <>
      <div className={cn("divide-y divide-gray-100 mb-4")}>
        {order.items &&
          order.items.map((item, idx) => {
            const name =
              getLocalizedString(item, "name", i18n.language) ||
              item.name ||
              t("product");
            const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
            const quantity = Number(item.quantity ?? 0);
            const colorName =
              item.colorName ||
              (typeof item.color === "object" ? item.color?.name : item.color) ||
              "";
            const sizeName =
              item.sizeName ||
              (typeof item.size === "object" ? item.size?.name : item.size) ||
              "";

            return (
              <div
                key={`${item.productId || "item"}-${idx}`}
                className={cn(
                  "flex items-center justify-between py-2.5 text-sm",
                )}
              >
                <div className={cn("flex items-center gap-3")}>
                  <img
                    src={getImageUrl(item.imageUrl || item.img)}
                    alt={name}
                    className={cn(
                      "w-12 h-12 object-cover rounded-md border",
                    )}
                  />
                  <div>
                    <p className={cn("font-bold text-gray-800")}>{name}</p>
                    <p className={cn("text-xs text-gray-400")}>
                      {t("qtyLabel")} {quantity}{" "}
                      {colorName ? `${t("colorLabel")} ${colorName}` : ""}{" "}
                      {sizeName ? `${t("sizeLabel")} ${sizeName}` : ""}
                    </p>
                  </div>
                </div>
                <span className={cn("font-bold text-gray-900")}>
                  {tCommon("egp")} {(unitPrice * quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
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
          {tCommon("egp")} {Number(order.total || 0).toFixed(2)}
        </span>
      </div>
    </>
  );
};
