import { createSlice, createSelector } from "@reduxjs/toolkit";

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  items: loadFromStorage("cart", []),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: {
      reducer(state, action) {
        const {
          id,
          name,
          price,
          originalPrice,
          newPrice,
          img,
          color,
          size,
          quantity,
        } = action.payload;

        const existingIndex = state.items.findIndex(
          (item) =>
            String(item.id) === String(id) &&
            item.color?.name === color?.name &&
            item.size?.name === size?.name,
        );

        if (existingIndex > -1) {
          state.items[existingIndex].quantity += quantity;
        } else {
          state.items.push({
            id,
            name,
            price,
            originalPrice,
            newPrice,
            img,
            color,
            size,
            quantity,
          });
        }
      },

      prepare(product, selectedColor = null, selectedSize = null, qty = 1) {
        const finalColor = selectedColor ||
          (product.colors && product.colors[0]) || { name: "Default" };
        const finalSize = selectedSize ||
          (product.sizes && product.sizes[0]) || {
            name: "Free Size",
            priceAdjustment: 0,
          };

        let basePrice = product.numericPrice;
        if (!basePrice && product.newPrice) {
          basePrice = parseFloat(product.newPrice.replace(/[^0-9.]/g, "")) || 0;
        }

        const colorPrice = finalColor.price ?? basePrice;
        const sizeAdj = finalSize.priceAdjustment || 0;
        const finalPrice = colorPrice + sizeAdj;

        let originalPrice = null;
        if (product.oldPrice) {
          originalPrice =
            (parseFloat(product.oldPrice.replace(/[^0-9.]/g, "")) || 0) +
            sizeAdj;
        }

        return {
          payload: {
            id: product.id,
            name: product.name,
            price: finalPrice,
            originalPrice,
            newPrice: `EGP ${finalPrice}`,
            img:
              finalColor.image ||
              product.img ||
              (product.images && product.images[0]) ||
              "",
            color: finalColor,
            size: finalSize,
            quantity: qty,
          },
        };
      },
    },

    changeQty(state, action) {
      const { index, delta } = action.payload;
      const item = state.items[index];
      if (item) {
        const newQty = item.quantity + delta;
        item.quantity = newQty < 1 ? 1 : newQty;
      }
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

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0),
);

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((count, item) => count + item.quantity, 0),
);

export const cartReducer = cartSlice.reducer;
