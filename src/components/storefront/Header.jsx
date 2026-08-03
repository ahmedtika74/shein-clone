import { cn } from "../../utils/cn";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn } from "../../store/authSlice";
import { selectCartCount } from "../../store/cartSlice";
import { selectWishlistCount } from "../../store/wishlistSlice";
import { selectSiteSettings } from "../../store/dataSlice";

export const Header = ({ searchQuery, setSearchQuery, setIsDrawerOpen }) => {
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const siteSettings = useSelector(selectSiteSettings);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={cn(
        "w-[95%] max-w-7xl mx-auto flex justify-between items-center py-4 bg-transparent relative",
      )}
    >
      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={cn(
          "md:hidden text-2xl text-gray-800 p-2 -ml-2 focus:outline-none z-10",
        )}
      >
        <i className={cn("fa-solid fa-bars")}></i>
      </button>

      {/* Logo / Site Name */}
      <div
        className={cn(
          "logo flex-shrink-0 absolute md:static left-1/2 -translate-x-1/2 md:translate-x-0 z-10",
        )}
      >
        <Link to="/">
          {siteSettings.type === "logo" ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings.siteName}
              className={cn("w-[90px] md:w-[100px] object-contain")}
            />
          ) : (
            <span
              className={cn(
                "text-2xl md:text-3xl font-black tracking-tighter uppercase",
              )}
            >
              {siteSettings.siteName}
            </span>
          )}
        </Link>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className={cn(
          "search w-1/2 relative hidden md:flex items-center group",
        )}
      >
        <div
          className={cn(
            "absolute left-4 text-gray-400 group-focus-within:text-black transition-colors",
          )}
        >
          <i className={cn("fa-solid fa-magnifying-glass text-lg")}></i>
        </div>
        <input
          type="text"
          placeholder="Search for items, brands and inspiration..."
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full h-11 pl-12 pr-4 bg-gray-100 hover:bg-gray-200 focus:bg-white rounded-full outline-none text-sm border border-transparent focus:border-gray-200 focus:ring-4 focus:ring-black/5 transition-all duration-300",
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className={cn(
              "absolute right-4 text-gray-400 hover:text-black transition-colors",
            )}
          >
            <i className={cn("fa-solid fa-xmark")}></i>
          </button>
        )}
      </form>

      {/* Icons & Actions */}
      <div className={cn("icons hidden md:flex items-center gap-2")}>
        {/* Wishlist Icon */}
        <Link
          to="/wishlist"
          className={cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-black relative",
          )}
        >
          <i className={cn("fa-regular fa-heart text-xl")}></i>
          {wishlistCount > 0 && (
            <span
              className={cn(
                "absolute top-0 right-0 bg-[#e60023] text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center shadow-sm animate-pulse-once",
              )}
            >
              {wishlistCount}
            </span>
          )}
          <span className={cn("text-[10px] font-medium mt-0.5")}>Wishlist</span>
        </Link>

        {/* Cart Shopping Icon */}
        <Link
          to="/cart"
          className={cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-black relative",
          )}
        >
          <i className={cn("fa-solid fa-cart-shopping text-xl")}></i>
          {cartCount > 0 && (
            <span
              className={cn(
                "absolute top-0 right-0 bg-[#e60023] text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center shadow-sm",
              )}
            >
              {cartCount}
            </span>
          )}
          <span className={cn("text-[10px] font-medium mt-0.5")}>Cart</span>
        </Link>

        {/* User Account */}
        {isLoggedIn ? (
          <div className={cn("flex items-center gap-2 mr-2")}>
            <Link
              to="/user-dashboard"
              className={cn(
                "flex items-center gap-2 p-2 px-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-black",
              )}
            >
              <i className={cn("fa-regular fa-user text-xl")}></i>
              <span
                className={cn(
                  "text-xs font-semibold truncate max-w-[80px] hidden lg:block",
                )}
              >
                {user?.name || "Account"}
              </span>
            </Link>
          </div>
        ) : (
          <Link
            to="/login"
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-black",
            )}
          >
            <i className={cn("fa-regular fa-user text-xl")}></i>
            <span className={cn("text-[10px] font-medium mt-0.5")}>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};
