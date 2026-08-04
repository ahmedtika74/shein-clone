import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { cartReducer } from "./cartSlice";
import { wishlistReducer } from "./wishlistSlice";
import { dataReducer } from "./dataSlice";

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Auth persistence
  if (action.type.startsWith("auth/")) {
    if (state.auth.registeredUser) {
      localStorage.setItem("user", JSON.stringify(state.auth.registeredUser));
    }

    if (state.auth.user) {
      localStorage.setItem("currentUser", JSON.stringify(state.auth.user));
    } else {
      localStorage.removeItem("currentUser");
    }

    if (state.auth.isLoggedIn) {
      localStorage.setItem("loggedIn", "true");
    } else {
      localStorage.removeItem("loggedIn");
    }

    if (state.auth.isAdminLoggedIn) {
      localStorage.setItem("adminLoggedIn", "true");
    } else {
      localStorage.removeItem("adminLoggedIn");
    }
  }

  // Cart persistence
  if (action.type.startsWith("cart/")) {
    localStorage.setItem("cart", JSON.stringify(state.cart.items));
  }

  // Wishlist persistence
  if (action.type.startsWith("wishlist/")) {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist.items));
  }

  // Data persistence
  if (action.type.startsWith("data/")) {
    const type = action.type.split("/")[1];
    try {
      if (type.toLowerCase().includes("product") || type.includes("Review")) {
        localStorage.setItem("products", JSON.stringify(state.data.products));
      } else if (type.includes("Categor")) {
        localStorage.setItem(
          "categories",
          JSON.stringify(state.data.categories),
        );
      } else if (type.includes("Hero")) {
        localStorage.setItem(
          "heroSlides",
          JSON.stringify(state.data.heroSlides),
        );
      } else if (type.includes("LeftSideCard")) {
        localStorage.setItem(
          "leftSideCards",
          JSON.stringify(state.data.leftSideCards),
        );
      } else if (type.includes("RightSideCard")) {
        localStorage.setItem(
          "rightSideCards",
          JSON.stringify(state.data.rightSideCards),
        );
      } else if (type.includes("Order")) {
        localStorage.setItem("orders", JSON.stringify(state.data.orders));
      } else if (type.includes("Color")) {
        localStorage.setItem("colors", JSON.stringify(state.data.colors));
      } else if (type.includes("Size")) {
        localStorage.setItem("sizes", JSON.stringify(state.data.sizes));
      } else if (type.includes("Offer")) {
        localStorage.setItem("offers", JSON.stringify(state.data.offers));
      } else if (type.includes("Payment")) {
        localStorage.setItem(
          "paymentMethods",
          JSON.stringify(state.data.paymentMethods),
        );
      } else if (type.includes("FreeShipping")) {
        localStorage.setItem(
          "freeShipping",
          JSON.stringify(state.data.freeShipping),
        );
      } else if (type.includes("Shipping")) {
        localStorage.setItem(
          "shippingRates",
          JSON.stringify(state.data.shippingRates),
        );
      } else if (type.includes("Announcement")) {
        localStorage.setItem(
          "announcements",
          JSON.stringify(state.data.announcements),
        );
      } else if (type.includes("SiteSettings")) {
        localStorage.setItem(
          "siteSettings",
          JSON.stringify(state.data.siteSettings),
        );
      }
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
