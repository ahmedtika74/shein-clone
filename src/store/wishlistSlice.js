import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient, getApiErrorMessage, toList } from "../services/apiClient";
import { toProduct } from "../services/mappers";
import { loadJson } from "../utils/storage";

const sameId = (a, b) => String(a) === String(b);

const asThunk = (name, work) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      return await work(arg, rejectWithValue);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  });

const mapWishlistItem = (dto) => {
  if (!dto) return null;

  // API shapes: full product, nested product, or sparse wishlist row
  if (dto.product) return toProduct(dto.product);

  if (dto.productId && !dto.nameEn && !dto.imageUrls && !dto.images) {
    const imageUrl =
      dto.imageUrl ||
      dto.img ||
      dto.productImageUrl ||
      dto.mainImageUrl ||
      "";
    return {
      id: dto.productId,
      nameEn: dto.productNameEn ?? dto.name ?? "",
      nameAr: dto.productNameAr ?? "",
      imageUrl,
      img: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      price: dto.price ?? dto.newPrice ?? 0,
    };
  }

  return toProduct({
    ...dto,
    id: dto.id ?? dto.productId,
  });
};

export const fetchWishlistThunk = asThunk("wishlist/fetch", async () =>
  toList(await apiClient.get("/wishlist"))
    .map(mapWishlistItem)
    .filter(Boolean),
);

export const addWishlistThunk = asThunk(
  "wishlist/add",
  async (product, rejectWithValue) => {
    const productId = product?.id ?? product;
    await apiClient.post(`/wishlist/${productId}`);
    return typeof product === "object" ? product : { id: productId };
  },
);

export const removeWishlistThunk = asThunk("wishlist/remove", async (productId) => {
  await apiClient.delete(`/wishlist/${productId}`);
  return productId;
});

/**
 * Toggle for logged-in users: hits API then updates Redux.
 * Guests use the local `toggleWishlist` reducer only.
 */
export const toggleWishlistThunk = createAsyncThunk(
  "wishlist/toggleRemote",
  async (product, { getState, dispatch, rejectWithValue }) => {
    try {
      const id = product?.id;
      const inList = getState().wishlist.items.some((item) =>
        sameId(item.id, id),
      );
      if (inList) {
        await dispatch(removeWishlistThunk(id)).unwrap();
        return { added: false, product };
      }
      await dispatch(addWishlistThunk(product)).unwrap();
      return { added: true, product };
    } catch (error) {
      return rejectWithValue(
        typeof error === "string" ? error : getApiErrorMessage(error),
      );
    }
  },
);

const initialState = {
  items: loadJson("wishlist", []),
  status: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload;
      const existingIndex = state.items.findIndex((item) =>
        sameId(item.id, product.id),
      );

      if (existingIndex > -1) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }
    },

    removeFromWishlist(state, action) {
      state.items = state.items.filter(
        (item) => !sameId(item.id, action.payload),
      );
    },

    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addWishlistThunk.fulfilled, (state, action) => {
        const product = action.payload;
        if (!state.items.some((item) => sameId(item.id, product.id))) {
          state.items.push(product);
        }
      })
      .addCase(removeWishlistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => !sameId(item.id, action.payload),
        );
      });
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => sameId(item.id, productId));

export const wishlistReducer = wishlistSlice.reducer;
