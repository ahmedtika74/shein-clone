import { useMemo } from "react";
import { cn } from "../../utils/cn";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWishlistItems,
  removeFromWishlist,
  removeWishlistThunk,
} from "../../store/wishlistSlice";
import { selectIsLoggedIn } from "../../store/authSlice";
import { selectProducts } from "../../store/dataSlice";
import { addToCart, selectCartItems } from "../../store/cartSlice";
import { SEO } from "../../components/common/SEO";
import { Button } from "../../components/ui";
import { getLocalizedString } from "../../utils/localization";
import { getImageUrl } from "../../utils/getImageUrl";
import {
  getTotalStock,
  getVariantStock,
  resolveColor,
  resolveSize,
} from "../../utils/variants";

const resolveWishlistImage = (item) =>
  item?.img ||
  item?.imageUrl ||
  item?.images?.[item?.mainIndex ?? 0] ||
  item?.images?.[0] ||
  item?.imageUrls?.[0] ||
  "";

export const WishlistPage = () => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector(selectWishlistItems);
  const products = useSelector(selectProducts);
  const cartItems = useSelector(selectCartItems);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleWishlistAddToCart = (item) => {
    const defaultColor = resolveColor(item, null);
    const defaultSize = resolveSize(item, null);
    const defaultStock = getVariantStock(item, defaultColor, defaultSize);
    const hasOtherStock = getTotalStock(item) > 0;

    if (hasOtherStock && defaultStock <= 0) {
      navigate(`/product/${item.id}`);
      return;
    }
    dispatch(addToCart(item));
  };

  // API wishlist rows are often sparse; fill image/name/price from catalog.
  const items = useMemo(() => {
    const byId = new Map(products.map((p) => [String(p.id), p]));
    return wishlist.map((item) => {
      const catalog = byId.get(String(item.id ?? item.productId));
      if (!catalog) return item;
      return {
        ...catalog,
        ...item,
        id: item.id ?? item.productId ?? catalog.id,
        img: resolveWishlistImage(item) || catalog.img || catalog.imageUrl,
        imageUrl:
          resolveWishlistImage(item) || catalog.imageUrl || catalog.img,
        images:
          item.images?.length || item.imageUrls?.length
            ? item.images || item.imageUrls
            : catalog.images,
        nameEn: item.nameEn || catalog.nameEn,
        nameAr: item.nameAr || catalog.nameAr,
        price: item.price || catalog.price,
      };
    });
  }, [wishlist, products]);

  const handleRemove = (id) => {
    if (isLoggedIn) dispatch(removeWishlistThunk(id));
    else dispatch(removeFromWishlist(id));
  };

  return (
    <div className={cn("wishlist-container w-[90%] max-w-275 mx-auto py-10")}>
      <SEO title="My Wishlist" noindex={true} />
      <h1 className={cn("text-3xl font-bold mb-8 text-gray-900")}>
        {t("myWishlist")} ({items.length})
      </h1>

      {items.length === 0 ? (
        <div
          className={cn(
            "bg-white p-12 rounded-2xl text-center border border-gray-200 shadow-sm my-6",
          )}
        >
          <i
            className={cn("fa-regular fa-heart text-6xl text-gray-300 mb-4")}
          ></i>
          <h2 className={cn("text-2xl font-bold text-gray-800")}>
            {t("emptyWishlist")}
          </h2>
          <p className={cn("text-gray-500 mt-2 mb-6")}>
            {t("emptyWishlistMessage")}
          </p>
          <Link
            to="/"
            className={cn(
              "inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors",
            )}
          >
            {t("discoverProducts")}
          </Link>
        </div>
      ) : (
        <div className={cn("flex flex-col gap-5")}>
          {items.map((item) => {
            const isInCart = cartItems.some(
              (cartItem) => String(cartItem.id) === String(item.id),
            );
            const imageSrc = getImageUrl(resolveWishlistImage(item));
            const needsVariantChoice =
              getTotalStock(item) > 0 &&
              getVariantStock(
                item,
                resolveColor(item, null),
                resolveSize(item, null),
              ) <= 0;

            return (
              <div
                key={item.id}
                className={cn(
                  "wishlist-item bg-white p-5 rounded-[10px] shadow-[0_2px_10px_#ddd] flex flex-col sm:flex-row items-center gap-6",
                )}
              >
                <Link
                  to={`/product/${item.id}`}
                  className={cn(
                    "shrink-0 block hover:opacity-80 transition-opacity",
                  )}
                >
                  <img
                    src={imageSrc}
                    alt={getLocalizedString(item, "name", i18n.language)}
                    className={cn("w-35 h-42.5 object-cover rounded-md")}
                  />
                </Link>
                <div className={cn("item-info flex-1 w-full")}>
                  <Link
                    to={`/product/${item.id}`}
                    className={cn("hover:underline")}
                  >
                    <h3 className={cn("text-xl font-bold text-gray-900 mb-1")}>
                      {getLocalizedString(item, "name", i18n.language)}
                    </h3>
                  </Link>
                  <p
                    className={cn(
                      "price text-lg font-bold text-[#e60023] mb-3",
                    )}
                  >
                    {formatPrice(item.price ?? item.newPrice, t) ||
                      `${t("egp")} ${item.numericPrice || item.price || 0}`}
                  </p>
                  <div
                    className={cn(
                      "flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100",
                    )}
                  >
                    <Button
                      onClick={() => {
                        if (isInCart) navigate("/cart");
                        else handleWishlistAddToCart(item);
                      }}
                      className={cn(
                        "rounded-full px-8",
                        isInCart && "bg-green-600 hover:bg-green-700",
                      )}
                    >
                      {isInCart ? (
                        <>
                          <i className={cn("fa-solid fa-check me-2")}></i>{" "}
                          {t("addedToCart")}
                        </>
                      ) : (
                        <>
                          <i
                            className={cn("fa-solid fa-cart-shopping me-2")}
                          ></i>{" "}
                          {needsVariantChoice
                            ? t("selectOptions")
                            : t("addToCart")}
                        </>
                      )}
                    </Button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className={cn(
                        "text-gray-500 hover:text-red-500 transition-colors text-sm font-semibold underline cursor-pointer",
                      )}
                    >
                      {t("removeItem")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
