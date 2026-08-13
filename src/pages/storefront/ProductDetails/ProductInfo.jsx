import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import {
  toggleWishlist,
  toggleWishlistThunk,
} from "../../../store/wishlistSlice";
import { formatPrice } from "../../../utils/formatPrice";
import { getLocalizedString } from "../../../utils/localization";

const LOW_STOCK_THRESHOLD = 5;

const optionClasses = (isSelected) =>
  isSelected
    ? "bg-black text-white border-black shadow-sm ring-2 ring-black ring-offset-1"
    : "bg-white text-gray-800 border-gray-300 hover:border-black";

export const ProductInfo = ({
  product,
  activePrice,
  selectedColor,
  selectColor,
  selectedSize,
  setSelectedSize,
  isInCart,
  isFav,
  isLoggedIn,
  handleAdd,
  dispatch,
  currentVariantStock,
}) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const isOutOfStock = currentVariantStock <= 0;

  const handleWishlist = () => {
    if (isLoggedIn) dispatch(toggleWishlistThunk(product));
    else dispatch(toggleWishlist(product));
  };

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
          {formatPrice(activePrice, t)}
        </span>
        {product.oldPrice > activePrice && (
          <span className={cn("old-price text-gray-400 line-through text-lg")}>
            {formatPrice(product.oldPrice, t)}
          </span>
        )}
        {product.offerBadge && (
          <span
            className={cn(
              "bg-[#e60023] text-white text-xs font-bold px-3 py-1 rounded-full",
            )}
          >
            {product.offerBadge}
          </span>
        )}
      </div>

      <p
        className={cn(
          "desc text-gray-600 leading-relaxed mb-6 whitespace-pre-line",
        )}
      >
        {getLocalizedString(product, "description", i18n.language)}
      </p>

      {product.colors.length > 0 && (
        <div className={cn("mb-6")}>
          <h3
            className={cn(
              "text-sm font-bold uppercase tracking-wider text-gray-900 mb-3",
            )}
          >
            {t("colorHeading")}
          </h3>
          <div className={cn("colors flex flex-wrap gap-2")}>
            {product.colors.map((color) => (
              <button
                key={color.nameEn}
                type="button"
                onClick={() => selectColor(color)}
                title={getLocalizedString(color, "name", i18n.language)}
                aria-pressed={selectedColor.nameEn === color.nameEn}
                className={cn(
                  "option flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium transition-all cursor-pointer",
                  optionClasses(selectedColor.nameEn === color.nameEn),
                )}
              >
                {color.hex && (
                  <span
                    className={cn(
                      "w-3 h-3 rounded-full me-2 border border-gray-300",
                    )}
                    style={{ backgroundColor: color.hex }}
                  ></span>
                )}
                {getLocalizedString(color, "name", i18n.language)}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className={cn("mb-6")}>
          <h3
            className={cn(
              "text-sm font-bold uppercase tracking-wider text-gray-900 mb-3",
            )}
          >
            {t("sizeHeading")}
          </h3>
          <div className={cn("sizes flex flex-wrap gap-2")}>
            {product.sizes.map((size) => (
              <button
                key={size.name}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize.name === size.name}
                title={
                  size.priceAdjustment
                    ? `${size.name} (+${formatPrice(size.priceAdjustment, t)})`
                    : size.name
                }
                className={cn(
                  "option px-5 py-2.5 rounded-md border text-sm font-medium transition-all cursor-pointer",
                  optionClasses(selectedSize.name === size.name),
                )}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={cn("mb-6")}>
        {isOutOfStock ? (
          <p className={cn("text-red-600 font-semibold")}>{t("outOfStock")}</p>
        ) : (
          <p className={cn("text-green-600 font-semibold")}>
            {currentVariantStock <= LOW_STOCK_THRESHOLD
              ? t("onlyLeftInStock", { count: currentVariantStock })
              : t("inStock")}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock && !isInCart}
        className={cn(
          "add-cart w-full h-13.75 font-bold text-lg rounded-xl shadow-md transition-all flex items-center justify-center gap-3 mt-4",
          isOutOfStock && !isInCart
            ? "bg-gray-400 cursor-not-allowed text-white"
            : isInCart
              ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              : "bg-black hover:bg-gray-900 text-white cursor-pointer",
        )}
      >
        {isInCart ? (
          <>
            <i className={cn("fa-solid fa-check")}></i>
            {t("addedToCart")}
          </>
        ) : isOutOfStock ? (
          t("outOfStock")
        ) : (
          <>
            <i className={cn("fa-solid fa-cart-shopping")}></i>
            {t("addToCart")}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleWishlist}
        className={cn(
          "wishlist w-full h-12.5 border border-black rounded-xl mt-4 font-semibold text-base flex items-center justify-center gap-2 cursor-pointer transition-all",
          isFav
            ? "bg-red-50 text-red-600 border-red-600"
            : "bg-white text-black hover:bg-gray-50",
        )}
      >
        <i
          className={cn(
            isFav ? "fa-solid text-red-600" : "fa-regular",
            "fa-heart text-lg",
          )}
        ></i>
        <span>{isFav ? t("removeFromWishlist") : t("addToWishlist")}</span>
      </button>
    </div>
  );
};
