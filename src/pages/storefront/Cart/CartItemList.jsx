import { useEffect } from "react";
import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { changeQty, removeItem } from "../../../store/cartSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectProducts } from "../../../store/dataSlice";
import { getLocalizedString } from "../../../utils/localization";
import { getImageUrl } from "../../../utils/getImageUrl";
import { getVariantKey, getVariantStock } from "../../../utils/variants";

const lineStock = (product, item) =>
  product
    ? getVariantStock(
        product,
        { nameEn: item.colorName },
        { name: item.sizeName },
      )
    : Number.isFinite(item.maxStock)
      ? item.maxStock
      : 0;

export const CartItemList = ({ cart, dispatch }) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const products = useSelector(selectProducts);

  // Clamp lines that were saved before stock limits were wired correctly.
  useEffect(() => {
    cart.forEach((item, index) => {
      const product = products.find((p) => String(p.id) === String(item.id));
      if (!product) return;
      const maxStock = lineStock(product, item);
      if (item.quantity > maxStock) {
        dispatch(
          changeQty({ index, delta: maxStock - item.quantity, maxStock }),
        );
      }
    });
  }, [cart, products, dispatch]);

  return (
    <div className={cn("flex-1")}>
      {cart.map((item, index) => {
        const product = products.find((p) => String(p.id) === String(item.id));
        const colorName = item.colorName || t("defaultColor");
        const sizeName = item.sizeName || t("freeSize");
        const maxStock = lineStock(product, item);
        const atMax = item.quantity >= maxStock;

        return (
          <div
            key={`${item.id}-${getVariantKey(
              { nameEn: item.colorName },
              { name: item.sizeName },
            )}-${index}`}
            className={cn(
              "cart-item bg-white p-5 mb-5 rounded-[10px] shadow-[0_2px_10px_#ddd] flex flex-col sm:flex-row items-center gap-6",
            )}
          >
            <Link
              to={`/product/${item.id}`}
              className={cn(
                "shrink-0 block hover:opacity-80 transition-opacity",
              )}
            >
              <img
                src={getImageUrl(item.img)}
                alt={
                  product
                    ? getLocalizedString(product, "name", i18n.language)
                    : getLocalizedString(item, "name", i18n.language)
                }
                className={cn("w-35 h-42.5 object-cover rounded-md shrink-0")}
              />
            </Link>
            <div className={cn("cart-info flex-1 w-full")}>
              <Link
                to={`/product/${item.id}`}
                className={cn("hover:underline")}
              >
                <h3 className={cn("text-xl font-bold text-gray-900 mb-1")}>
                  {product
                    ? getLocalizedString(product, "name", i18n.language)
                    : getLocalizedString(item, "name", i18n.language)}
                </h3>
              </Link>
              {(item.colorName || item.sizeName) && (
                <p className={cn("text-xs text-gray-500 mb-2")}>
                  {item.colorName && (
                    <span>
                      {t("color")}{" "}
                      {i18n.language?.startsWith("ar")
                        ? item.colorNameAr || colorName
                        : colorName}{" "}
                    </span>
                  )}
                  {item.sizeName && (
                    <span>
                      | {t("size")} {sizeName}
                    </span>
                  )}
                </p>
              )}
              <div className={cn("flex items-center gap-2 mb-3")}>
                <p className={cn("price text-lg font-bold text-[#e60023]")}>
                  {t("egp")} {item.price.toFixed(2)}
                </p>
                {item.originalPrice && item.originalPrice > item.price && (
                  <p className={cn("text-sm text-gray-400 line-through")}>
                    {t("egp")} {item.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              {product && (
                <p className={cn("text-xs text-gray-400 mb-2")}>
                  {t("stockLeft", {
                    defaultValue: "In stock: {{count}}",
                    count: maxStock,
                  })}
                </p>
              )}
              <div
                className={cn(
                  "flex items-center justify-between flex-wrap gap-4 mt-4",
                )}
              >
                <div className={cn("quantity flex items-center gap-3")}>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(changeQty({ index, delta: -1, maxStock }))
                    }
                    className={cn(
                      "w-8.75 h-8.75 border border-gray-300 bg-white font-bold text-lg hover:bg-gray-100 rounded-md cursor-pointer flex items-center justify-center",
                    )}
                  >
                    -
                  </button>
                  <span className={cn("font-bold text-base w-6 text-center")}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={atMax}
                    onClick={() =>
                      dispatch(changeQty({ index, delta: 1, maxStock }))
                    }
                    className={cn(
                      "w-8.75 h-8.75 border border-gray-300 font-bold text-lg rounded-md flex items-center justify-center",
                      atMax
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100 cursor-pointer",
                    )}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeItem(index))}
                  className={cn(
                    "remove bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-red-600 transition-colors cursor-pointer",
                  )}
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
