import { configureStore } from "@reduxjs/toolkit";
import { authReducer, STORAGE_KEYS } from "./authSlice";
import { cartReducer } from "./cartSlice";
import { wishlistReducer } from "./wishlistSlice";
import { dataReducer } from "./dataSlice";
import { saveJson } from "../utils/storage";

/** Single place that mirrors state into localStorage, keyed by action prefix. */
const persistenceRules = [
  {
    prefix: "auth/",
    persist: (state) => {
      const { user, adminToken } = state.auth;

      if (user) saveJson(STORAGE_KEYS.user, user);
      else localStorage.removeItem(STORAGE_KEYS.user);

      if (adminToken) localStorage.setItem(STORAGE_KEYS.adminToken, adminToken);
      else localStorage.removeItem(STORAGE_KEYS.adminToken);
    },
  },
  { prefix: "cart/", persist: (state) => saveJson("cart", state.cart.items) },
  {
    prefix: "wishlist/",
    persist: (state) => saveJson("wishlist", state.wishlist.items),
  },
];

const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  persistenceRules
    .filter(({ prefix }) => action.type.startsWith(prefix))
    .forEach(({ persist }) => persist(store.getState()));

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
    getDefaultMiddleware().concat(persistenceMiddleware),
});
