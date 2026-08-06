import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { changeQty, removeItem } from "../../../store/cartSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectProducts } from "../../../store/dataSlice";
import { getLocalizedString } from "../../../utils/localization";

export const CartItemList = ({ cart, dispatch }) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const products = useSelector(selectProducts);
  return (
    <div className={cn("flex-1")}>
      {cart.map((item, index) => {
        const product = products.find((p) => String(p.id) === String(item.id));
        const cName =
          item.color?.nameEn ||
          item.color?.name ||
          item.color ||
          t("defaultColor");
        const sName = item.size?.name || item.size || t("freeSize");
        const variantKey = `${cName}-${sName}`;
        const maxStock =
          product?.variantsStock?.[variantKey] !== undefined
            ? product.variantsStock[variantKey]
            : Infinity;

        return (
          <div
            key={
              item.id
                ? `${item.id}-${item.color?.name || "def"}-${item.size?.name || "def"}`
                : `cart-${index}`
            }
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
                src={item.img}
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
              {(item.color || item.size) && (
                <p className={cn("text-xs text-gray-500 mb-2")}>
                  {item.color && (
                    <span>
                      {t("color")}{" "}
                      {typeof item.color === "object"
                        ? getLocalizedString(item.color, "name", i18n.language)
                        : item.color}{" "}
                    </span>
                  )}
                  {item.size && (
                    <span>
                      | {t("size")}{" "}
                      {typeof item.size === "object"
                        ? item.size.name
                        : item.size}
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
              <div
                className={cn(
                  "flex items-center justify-between flex-wrap gap-4 mt-4",
                )}
              >
                <div className={cn("quantity flex items-center gap-3")}>
                  <button
                    onClick={() => dispatch(changeQty({ index, delta: -1 }))}
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
                    disabled={item.quantity >= maxStock}
                    onClick={() => dispatch(changeQty({ index, delta: 1 }))}
                    className={cn(
                      "w-8.75 h-8.75 border border-gray-300 font-bold text-lg rounded-md flex items-center justify-center",
                      item.quantity >= maxStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100 cursor-pointer",
                    )}
                  >
                    +
                  </button>
                </div>
                <button
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
