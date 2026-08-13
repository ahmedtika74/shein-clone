import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../store/cartSlice";
import { selectWishlistCount } from "../../store/wishlistSlice";

export const BottomNav = ({ isMobileSearchOpen, setIsMobileSearchOpen }) => {
  const { t } = useTranslation(["storefront", "common"]);
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 start-0 w-full h-[60px] bg-white border-t border-gray-100 z-50 flex items-center justify-around pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)]",
      )}
    >
      <Link
        to="/"
        className={cn(
          "flex flex-col items-center justify-center w-14 h-full transition-colors",
          location.pathname === "/"
            ? "text-black"
            : "text-gray-400 hover:text-gray-900",
        )}
      >
        <i className={cn("text-xl mb-1 fa-solid fa-house")}></i>
        <span className={cn("text-[10px] font-semibold")}>{t("home")}</span>
      </Link>

      <button
        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        className={cn(
          "flex flex-col items-center justify-center w-14 h-full transition-colors",
          isMobileSearchOpen
            ? "text-black"
            : "text-gray-400 hover:text-gray-900",
        )}
      >
        <i className={cn("fa-solid fa-magnifying-glass text-xl mb-1")}></i>
        <span className={cn("text-[10px] font-semibold")}>Search</span>
      </button>

      <Link
        to="/wishlist"
        className={cn(
          "flex flex-col items-center justify-center w-14 h-full transition-colors relative",
          location.pathname === "/wishlist"
            ? "text-black"
            : "text-gray-400 hover:text-gray-900",
        )}
      >
        <div className={cn("relative")}>
          <i
            className={cn(
              "text-xl mb-1",
              location.pathname === "/wishlist"
                ? "fa-solid fa-heart text-red-500"
                : "fa-regular fa-heart",
            )}
          ></i>
          {wishlistCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -end-2 bg-[#e60023] text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center",
              )}
            >
              {wishlistCount}
            </span>
          )}
        </div>
        <span className={cn("text-[10px] font-semibold")}>Wishlist</span>
      </Link>

      <Link
        to="/cart"
        className={cn(
          "flex flex-col items-center justify-center w-14 h-full transition-colors relative",
          location.pathname === "/cart"
            ? "text-black"
            : "text-gray-400 hover:text-gray-900",
        )}
      >
        <div className={cn("relative")}>
          <i className={cn("fa-solid fa-cart-shopping text-xl mb-1")}></i>
          {cartCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -end-2 bg-[#e60023] text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center",
              )}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span className={cn("text-[10px] font-semibold")}>Bag</span>
      </Link>

      <Link
        to="/user-dashboard"
        className={cn(
          "flex flex-col items-center justify-center w-14 h-full transition-colors",
          location.pathname === "/user-dashboard" ||
            location.pathname === "/login"
            ? "text-black"
            : "text-gray-400 hover:text-gray-900",
        )}
      >
        <i
          className={cn(
            "text-xl mb-1",
            location.pathname === "/user-dashboard" ||
              location.pathname === "/login"
              ? "fa-solid fa-user"
              : "fa-regular fa-user",
          )}
        ></i>
        <span className={cn("text-[10px] font-semibold")}>Me</span>
      </Link>
    </div>
  );
};
