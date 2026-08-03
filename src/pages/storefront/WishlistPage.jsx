import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWishlistItems,
  removeFromWishlist,
} from "../../store/wishlistSlice";
import { addToCart, selectCartItems } from "../../store/cartSlice";
import { SEO } from "../../components/common/SEO";
import { Button } from "../../components/ui";

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);

  return (
    <div className={cn("wishlist-container w-[90%] max-w-275 mx-auto py-10")}>
      <SEO title="My Wishlist" noindex={true} />
      <h1 className={cn("text-3xl font-bold mb-8 text-gray-900")}>
        My Wishlist ({wishlist.length})
      </h1>

      {wishlist.length === 0 ? (
        <div
          className={cn(
            "bg-white p-12 rounded-2xl text-center border border-gray-200 shadow-sm my-6",
          )}
        >
          <i
            className={cn("fa-regular fa-heart text-6xl text-gray-300 mb-4")}
          ></i>
          <h2 className={cn("text-2xl font-bold text-gray-800")}>
            Your Wishlist is Empty
          </h2>
          <p className={cn("text-gray-500 mt-2 mb-6")}>
            Explore products and save your favorites here.
          </p>
          <Link
            to="/"
            className={cn(
              "inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors",
            )}
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className={cn("flex flex-col gap-5")}>
          {wishlist.map((item) => {
            const isInCart = cartItems.some(
              (cartItem) => String(cartItem.id) === String(item.id),
            );

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
                    src={item.img || (item.images && item.images[0])}
                    alt={item.name}
                    className={cn("w-35 h-42.5 object-cover rounded-md")}
                  />
                </Link>
                <div className={cn("item-info flex-1 w-full")}>
                  <Link
                    to={`/product/${item.id}`}
                    className={cn("hover:underline")}
                  >
                    <h3 className={cn("text-xl font-bold text-gray-900 mb-1")}>
                      {item.name}
                    </h3>
                  </Link>
                  <p
                    className={cn(
                      "price text-lg font-bold text-[#e60023] mb-3",
                    )}
                  >
                    {item.newPrice || `EGP ${item.numericPrice || item.price}`}
                  </p>
                  <div
                    className={cn(
                      "flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100",
                    )}
                  >
                    <Button
                      onClick={() => dispatch(addToCart(item))}
                      className={cn(
                        "rounded-full px-8",
                        isInCart && "bg-green-600 hover:bg-green-700",
                      )}
                    >
                      {isInCart ? (
                        <>
                          <i className={cn("fa-solid fa-check mr-2")}></i> Added
                          to Cart!
                        </>
                      ) : (
                        <>
                          <i
                            className={cn("fa-solid fa-cart-shopping mr-2")}
                          ></i>{" "}
                          Add To Cart
                        </>
                      )}
                    </Button>
                    <button
                      onClick={() => dispatch(removeFromWishlist(item.id))}
                      className={cn(
                        "text-gray-500 hover:text-red-500 transition-colors text-sm font-semibold underline cursor-pointer",
                      )}
                    >
                      Remove item
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
