import { cn } from "../../utils/cn";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, selectCartItems } from "../../store/cartSlice";
import { toggleWishlist, selectIsInWishlist } from "../../store/wishlistSlice";

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsInWishlist(product.id));
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const isInCart = cartItems.some(
    (item) => String(item.id) === String(product.id),
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      navigate("/cart");
    } else {
      dispatch(addToCart(product));
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const discountPercent =
    product.oldPrice && product.newPrice
      ? Math.round(
          ((parseFloat(product.oldPrice.replace(/[^0-9.]/g, "")) -
            parseFloat(product.newPrice.replace(/[^0-9.]/g, ""))) /
            parseFloat(product.oldPrice.replace(/[^0-9.]/g, ""))) *
            100,
        )
      : null;

  const totalStock = product.variantsStock
    ? Object.values(product.variantsStock).reduce((acc, curr) => acc + curr, 0)
    : 0;
  const isOutOfStock = totalStock <= 0;

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
            src={product.img || (product.images && product.images[0])}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-400 group-hover:scale-108",
            )}
          />
        </Link>
        {(discountPercent > 0 || product.offer) && !isOutOfStock && (
          <span
            className={cn(
              "discount absolute top-3 left-3 bg-[#e60023] text-white text-[12px] font-bold px-3 py-1 rounded-full shadow",
            )}
          >
            {discountPercent > 0 ? `-${discountPercent}%` : product.offer}
          </span>
        )}
        {isOutOfStock && (
          <span
            className={cn(
              "out-of-stock absolute top-3 left-3 bg-black text-white text-[12px] font-bold px-3 py-1 rounded-full shadow",
            )}
          >
            Out of Stock
          </span>
        )}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            `heart absolute top-3 right-3 w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer text-[19px] z-10 shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-115 ${isFavorite ? "text-red-600 bg-[#fff0f0]" : "text-gray-700 bg-white hover:text-red-600"}`,
          )}
          aria-label="Add to Wishlist"
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
              {product.name}
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
              {product.newPrice}
            </span>
            {product.oldPrice && (
              <span
                className={cn(
                  "old-price text-gray-400 line-through text-[11px] sm:text-xs md:text-sm",
                )}
              >
                {product.oldPrice}
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
              ? "Out of Stock"
              : isInCart
                ? "Added to Cart! ✓"
                : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};
