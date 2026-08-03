import { cn } from "../../../utils/cn";
import { Link } from "react-router-dom";
import { SEO } from "../../../components/common/SEO";
import { useCartLogic } from "./useCartLogic";
import { CartItemList } from "./CartItemList";
import { CheckoutPanel } from "./CheckoutPanel";

export const CartPage = () => {
  const logic = useCartLogic();

  return (
    <div className={cn("cart-container w-[90%] max-w-275 mx-auto py-10")}>
      <SEO title="Shopping Cart" noindex={true} />
      <h1 className={cn("text-3xl font-bold mb-8 text-gray-900")}>
        Shopping Cart ({logic.cart.length})
      </h1>

      {logic.checkoutMessage ? (
        <div
          className={cn(
            "bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl text-center my-6",
          )}
        >
          <i
            className={cn(
              "fa-solid fa-circle-check text-5xl text-green-600 mb-3",
            )}
          ></i>
          <h2 className={cn("text-2xl font-bold")}>{logic.checkoutMessage}</h2>
          <p className={cn("text-gray-600 mt-2")}>
            Thank you for shopping with {logic.siteSettings?.siteName || "us"}!
            Your order has been placed.
          </p>
          <Link
            to="/user-dashboard"
            className={cn(
              "inline-block mt-6 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors",
            )}
          >
            View Orders
          </Link>
        </div>
      ) : logic.cart.length === 0 ? (
        <div
          className={cn(
            "bg-white p-12 rounded-2xl text-center border border-gray-200 shadow-sm my-6",
          )}
        >
          <i
            className={cn(
              "fa-solid fa-cart-shopping text-6xl text-gray-300 mb-4",
            )}
          ></i>
          <h2 className={cn("text-2xl font-bold text-gray-800")}>
            Your bag is empty
          </h2>
          <p className={cn("text-gray-500 mt-2 mb-6")}>
            Looks like you haven&apos;t added any items yet.
          </p>
          <Link
            to="/"
            className={cn(
              "inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors",
            )}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={cn("flex flex-col lg:flex-row gap-8")}>
          <CartItemList cart={logic.cart} dispatch={logic.dispatch} />
          <CheckoutPanel {...logic} />
        </div>
      )}
    </div>
  );
};
