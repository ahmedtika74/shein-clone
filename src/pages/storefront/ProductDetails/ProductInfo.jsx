import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { toggleWishlist } from "../../../store/wishlistSlice";
import { formatPrice } from "../../../utils/formatPrice";
import { getLocalizedString } from "../../../utils/localization";

export const ProductInfo = ({
  product,
  activePriceStr,
  selectedColor,
  setSelectedColor,
  setSelectedImg,
  selectedSize,
  setSelectedSize,
  isInCart,
  isFav,
  handleAdd,
  dispatch,
  currentVariantStock,
}) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  return (
    <div
      className={cn("details-info w-full md:w-1/2 flex flex-col justify-start")}
    >
      <h1 className={cn("text-2xl md:text-3xl font-bold text-gray-900 mb-3")}>
        {getLocalizedString(product, "name", i18n.language)}
      </h1>

      <div className={cn("price flex items-center gap-4 mb-6")}>
        <span
          className={cn("new-price text-2xl md:text-3xl font-bold text-black")}
        >
          {formatPrice(activePriceStr, t)}
        </span>
        {product.oldPrice && (
          <span className={cn("old-price text-gray-400 line-through text-lg")}>
            {formatPrice(product.oldPrice, t)}
          </span>
        )}
        {product.offer && (
          <span
            className={cn(
              "bg-[#e60023] text-white text-xs font-bold px-3 py-1 rounded-full",
            )}
          >
            {product.offer}
          </span>
        )}
      </div>
      <p className={cn("desc text-gray-600 leading-relaxed mb-6")}>
        {getLocalizedString(product, "description", i18n.language) ||
          "Women's fashion item. High quality and comfortable design."}
      </p>

      {/* Color Selection */}
      <div className={cn("mb-6")}>
        <h3
          className={cn(
            "text-sm font-bold uppercase tracking-wider text-gray-900 mb-3",
          )}
        >
          Color
        </h3>
        <div className={cn("colors flex flex-wrap gap-2")}>
          {(product?.colors?.length > 0
            ? product.colors
            : [{ name: "Black" }, { name: "White" }, { name: "Pink" }]
          ).map((c, i) => (
            <button
              key={c.nameEn || c.name || `color-${i}`}
              onClick={() => {
                setSelectedColor(c);
                if (c.image) setSelectedImg(c.image);
              }}
              title={getLocalizedString(c, "name", i18n.language)}
              className={cn(
                `option flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                  (selectedColor?.nameEn &&
                    selectedColor.nameEn === c.nameEn) ||
                  (selectedColor?.name && selectedColor.name === c.name)
                    ? "bg-black text-white border-black shadow-sm ring-2 ring-black ring-offset-1"
                    : "bg-white text-gray-800 border-gray-300 hover:border-black"
                }`,
              )}
            >
              {c.hex && (
                <span
                  className={cn(
                    "w-3 h-3 rounded-full me-2 border border-gray-300",
                  )}
                  style={{ backgroundColor: c.hex }}
                ></span>
              )}
              {getLocalizedString(c, "name", i18n.language)}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className={cn("mb-6")}>
        <h3
          className={cn(
            "text-sm font-bold uppercase tracking-wider text-gray-900 mb-3",
          )}
        >
          Size
        </h3>
        <div className={cn("sizes flex flex-wrap gap-2")}>
          {(product?.sizes?.length > 0
            ? product.sizes
            : [{ name: "S" }, { name: "M" }, { name: "L" }, { name: "XL" }]
          ).map((s, i) => (
            <button
              key={s.name || `size-${i}`}
              onClick={() => setSelectedSize(s)}
              title={
                s.priceAdjustment
                  ? `${s.name} (+EGP ${s.priceAdjustment})`
                  : s.name
              }
              className={cn(
                `option px-5 py-2.5 rounded-md border text-sm font-medium transition-all ${
                  selectedSize?.name === s.name
                    ? "bg-black text-white border-black shadow-sm ring-2 ring-black ring-offset-1"
                    : "bg-white text-gray-800 border-gray-300 hover:border-black"
                }`,
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("mb-6")}>
        {currentVariantStock > 0 ? (
          <p className={cn("text-green-600 font-semibold")}>
            {currentVariantStock <= 5
              ? t("onlyLeftInStock", { count: currentVariantStock })
              : "In Stock"}
          </p>
        ) : (
          <p className={cn("text-red-600 font-semibold")}>{t("outOfStock")}</p>
        )}
      </div>

      <button
        onClick={handleAdd}
        disabled={currentVariantStock <= 0}
        className={cn(
          `add-cart w-full h-13.75 font-bold text-lg rounded-xl shadow-md transition-all flex items-center justify-center gap-3 mt-4 ${
            currentVariantStock <= 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : isInCart
                ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                : "bg-black hover:bg-gray-900 text-white cursor-pointer"
          }`,
        )}
      >
        {currentVariantStock <= 0 ? (
          t("outOfStock")
        ) : isInCart ? (
          <>
            <i className={cn("fa-solid fa-check")}></i>
            {t("addedToCart")}
          </>
        ) : (
          <>
            <i className={cn("fa-solid fa-cart-shopping")}></i>
            {t("addToCart")}
          </>
        )}
      </button>
      <button
        onClick={() => dispatch(toggleWishlist(product))}
        className={cn(
          `wishlist w-full h-12.5 border border-black rounded-xl mt-4 font-semibold text-base flex items-center justify-center gap-2 cursor-pointer transition-all ${
            isFav
              ? "bg-red-50 text-red-600 border-red-600"
              : "bg-white text-black hover:bg-gray-50"
          }`,
        )}
      >
        <i
          className={cn(
            `${isFav ? "fa-solid text-red-600" : "fa-regular"} fa-heart text-lg`,
          )}
        ></i>
        <span>{isFav ? t("removeFromWishlist") : t("addToWishlist")}</span>
      </button>
    </div>
  );
};
