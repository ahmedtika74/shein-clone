import { cn } from "../../utils/cn";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, selectCartItems } from "../../store/cartSlice";
import {
  toggleWishlist,
  toggleWishlistThunk,
  selectIsInWishlist,
} from "../../store/wishlistSlice";
import { selectIsLoggedIn } from "../../store/authSlice";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";
import { getLocalizedString } from "../../utils/localization";
import { getImageUrl } from "../../utils/getImageUrl";
import {
  getTotalStock,
  getVariantKey,
  getVariantStock,
  resolveColor,
  resolveSize,
} from "../../utils/variants";

export const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsInWishlist(product.id));
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);

  // Quick-add always uses the default variant, so "in cart" must match it too.
  const defaultColor = resolveColor(product, null);
  const defaultSize = resolveSize(product, null);
  const defaultStock = getVariantStock(product, defaultColor, defaultSize);
  const isOutOfStock = getTotalStock(product) <= 0;
  // Default colour/size is empty but another variant has stock — send user to pick.
  const needsVariantChoice = !isOutOfStock && defaultStock <= 0;
  const isInCart = cartItems.some(
    (item) =>
      String(item.id) === String(product.id) &&
      getVariantKey({ nameEn: item.colorName }, { name: item.sizeName }) ===
        getVariantKey(defaultColor, defaultSize),
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      navigate("/cart");
      return;
    }
    if (needsVariantChoice) {
      navigate(`/product/${product.id}`);
      return;
    }
    dispatch(addToCart(product));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) dispatch(toggleWishlistThunk(product));
    else dispatch(toggleWishlist(product));
  };

  const discountPercent =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  return (
    <div
      className={cn(
        "product bg-white rounded-[15px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col group relative",
      )}
    >
      <div
        className={cn(
          "product-image relative w-full h-[200px] sm:h-[250px] md:h-[320px] overflow-hidden bg-gray-50",
        )}
      >
        <Link to={`/product/${product.id}`}>
          <img
            src={getImageUrl(product.img)}
            alt={getLocalizedString(product, "name", i18n.language)}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-transform duration-400 group-hover:scale-108",
            )}
          />
        </Link>
        {(discountPercent > 0 || product.offerBadge) && !isOutOfStock && (
          <span
            className={cn(
              "discount absolute top-3 start-3 bg-[#e60023] text-white text-[12px] font-bold px-3 py-1 rounded-full shadow",
            )}
          >
            {discountPercent > 0 ? `-${discountPercent}%` : product.offerBadge}
          </span>
        )}
        {isOutOfStock && (
          <span
            className={cn(
              "out-of-stock absolute top-3 start-3 bg-black text-white text-[12px] font-bold px-3 py-1 rounded-full shadow",
            )}
          >
            {t("outOfStock")}
          </span>
        )}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            `heart absolute top-3 end-3 w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer text-[19px] z-10 shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-115 ${isFavorite ? "text-red-600 bg-[#fff0f0]" : "text-gray-700 bg-white hover:text-red-600"}`,
          )}
          aria-label={
            isFavorite ? t("removeFromWishlist") : t("addToWishlist")
          }
        >
          <i
            className={cn(`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`)}
          ></i>
        </button>
      </div>
      <div
        className={cn(
          "product-info p-3 sm:p-4 md:p-[18px] flex flex-col flex-1 justify-between",
        )}
      >
        <div>
          <Link to={`/product/${product.id}`}>
            <h4
              className={cn(
                "text-[14px] sm:text-[15px] md:text-[17px] font-semibold text-gray-900 mb-2 min-h-[40px] line-clamp-2 hover:text-[#e60023] transition-colors",
              )}
            >
              {getLocalizedString(product, "name", i18n.language)}
            </h4>
          </Link>
          <div
            className={cn(
              "price flex items-center flex-wrap gap-1 sm:gap-2 mb-3 md:mb-4",
            )}
          >
            <span
              className={cn(
                "new-price text-[#e60023] text-[15px] sm:text-[17px] md:text-[21px] font-bold leading-none",
              )}
            >
              {formatPrice(product.price, t)}
            </span>
            {product.oldPrice > product.price && (
              <span
                className={cn(
                  "old-price text-gray-400 line-through text-[11px] sm:text-xs md:text-sm",
                )}
              >
                {formatPrice(product.oldPrice, t)}
              </span>
            )}
          </div>
        </div>
        <div className={cn("flex flex-col gap-2 mt-2")}>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              `add-btn w-full h-[36px] sm:h-[40px] md:h-[45px] rounded-[10px] text-white font-bold text-[13px] md:text-[15px] transition-colors duration-300 ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : isInCart
                    ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                    : "bg-[#111] hover:bg-[#e60023] cursor-pointer"
              }`,
            )}
          >
            {isOutOfStock
              ? t("outOfStock")
              : isInCart
                ? t("addedToCart") + " ✓"
                : needsVariantChoice
                  ? t("selectOptions")
                  : t("addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
};
