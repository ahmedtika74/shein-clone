import { createSlice, createSelector } from "@reduxjs/toolkit";
import { loadJson } from "../utils/storage";
import {
  getVariantImage,
  getVariantOldPrice,
  getVariantPrice,
  getVariantStock,
  resolveColor,
  resolveSize,
} from "../utils/variants";

/**
 * Cart lines are stored flat (colour and size as plain names) so they map
 * straight onto OrderItemCreateDto and compare reliably for line identity.
 */
const isValidLine = (line) =>
  line &&
  line.id !== undefined &&
  typeof line.colorName === "string" &&
  typeof line.sizeName === "string" &&
  Number.isFinite(line.price);

const initialState = {
  items: loadJson("cart", []).filter(isValidLine),
};

const isSameLine = (line, { id, colorName, sizeName }) =>
  String(line.id) === String(id) &&
  line.colorName === colorName &&
  line.sizeName === sizeName;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: {
      reducer(state, action) {
        const line = action.payload;
        if (!line || line.quantity <= 0) return;

        const existing = state.items.find((item) => isSameLine(item, line));
        const ceiling = Number.isFinite(line.maxStock)
          ? line.maxStock
          : Infinity;

        if (existing) {
          existing.quantity = Math.min(
            existing.quantity + line.quantity,
            ceiling,
          );
          if (Number.isFinite(line.maxStock)) {
            existing.maxStock = line.maxStock;
          }
        } else {
          state.items.push(line);
        }
      },

      prepare(product, selectedColor = null, selectedSize = null, qty = 1) {
        const color = resolveColor(product, selectedColor);
        const size = resolveSize(product, selectedSize);
        const maxStock = getVariantStock(product, color, size);
        const requested = Math.max(1, Number(qty) || 1);

        return {
          payload: {
            id: product.id,
            productId: product.id,
            nameEn: product.nameEn ?? "",
            nameAr: product.nameAr ?? "",
            colorName: color.nameEn || color.name || "",
            colorNameAr: color.nameAr || color.nameEn || "",
            colorHex: color.hex || "",
            sizeName: size.name || "",
            price: getVariantPrice(product, color, size),
            originalPrice: getVariantOldPrice(product, size),
            img: getVariantImage(product, color),
            quantity: Math.min(requested, maxStock),
            maxStock,
          },
        };
      },
    },

    changeQty(state, action) {
      const { index, delta, maxStock } = action.payload;
      const item = state.items[index];
      if (!item) return;

      const ceiling = Number.isFinite(maxStock)
        ? maxStock
        : Number.isFinite(item.maxStock)
          ? item.maxStock
          : Infinity;
      item.quantity = Math.min(Math.max(1, item.quantity + delta), ceiling);
    },

    removeItem(state, action) {
      state.items.splice(action.payload, 1);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, changeQty, removeItem, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0),
);

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((count, item) => count + item.quantity, 0),
);

export const cartReducer = cartSlice.reducer;
