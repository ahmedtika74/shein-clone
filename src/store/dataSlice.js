import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  initialProducts,
  initialCategories,
  initialHeroSlides,
  initialLeftSideCards,
  initialRightSideCards,
} from "../data/initialData";

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

import { apiClient } from "../services/apiClient";

export const fetchProductsThunk = createAsyncThunk(
  "data/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/products");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const formatProductData = (
  productData,
  editIndex = -1,
  existingProducts = [],
) => {
  const newPriceStr = String(productData.newPrice || "");
  const oldPriceStr = String(productData.oldPrice || "");
  const numericPrice = parseFloat(newPriceStr.replace(/[^0-9.]/g, "")) || 0;

  return {
    id:
      editIndex === -1
        ? crypto.randomUUID()
        : existingProducts[editIndex]?.id || crypto.randomUUID(),
    nameEn: productData.nameEn,
    nameAr: productData.nameAr,
    newPrice: newPriceStr.startsWith("EGP ")
      ? newPriceStr
      : `EGP ${newPriceStr}`,
    oldPrice: oldPriceStr
      ? oldPriceStr.startsWith("EGP ")
        ? oldPriceStr
        : `EGP ${oldPriceStr}`
      : "",
    numericPrice,
    img:
      productData.images && productData.images.length > 0
        ? productData.images[productData.mainIndex || 0]
        : productData.img || "/images/top.jpg",
    images: productData.images || [productData.img || "/images/top.jpg"],
    mainIndex: productData.mainIndex || 0,
    category: productData.category || "General",
    colors: Array.isArray(productData.colors)
      ? productData.colors.map((c) =>
          typeof c === "string"
            ? { nameEn: c, nameAr: c, hex: "", image: "", price: null }
            : c,
        )
      : productData.colors
        ? productData.colors.split(",").map((c) => ({
            nameEn: c.trim(),
            nameAr: c.trim(),
            hex: "",
            image: "",
            price: null,
          }))
        : [
            {
              nameEn: "Default",
              nameAr: "Default",
              hex: "",
              image: "",
              price: null,
            },
          ],
    sizes: Array.isArray(productData.sizes)
      ? productData.sizes.map((s) =>
          typeof s === "string" ? { name: s, priceAdjustment: 0 } : s,
        )
      : productData.sizes
        ? productData.sizes
            .split(",")
            .map((s) => ({ name: s.trim(), priceAdjustment: 0 }))
        : [{ name: "Free Size", priceAdjustment: 0 }],
    offer: productData.offer || "",
    descriptionEn:
      productData.descriptionEn ||
      "Women's fashion item. High quality and comfortable design.",
    descriptionAr:
      productData.descriptionAr || "عنصر أزياء نسائي. جودة عالية وتصميم مريح.",
    rating: 0,
    reviewsCount: 0,
    reviews: [],
    variantsStock: productData.variantsStock || {},
  };
};

export const createProductThunk = createAsyncThunk(
  "data/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/products", product);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  "data/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/products/${product.id}`, product);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteProductThunk = createAsyncThunk(
  "data/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCategoriesThunk = createAsyncThunk(
  "data/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/categories");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createCategoryThunk = createAsyncThunk(
  "data/createCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/categories", category);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateCategoryThunk = createAsyncThunk(
  "data/updateCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/categories/${category.id}`,
        category,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCategoryThunk = createAsyncThunk(
  "data/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchOrdersThunk = createAsyncThunk(
  "data/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/orders");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createOrderThunk = createAsyncThunk(
  "data/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/orders", order);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateOrderStatusThunk = createAsyncThunk(
  "data/updateOrderStatus",
  async (
    { orderId, status, refundReason, refusalReason },
    { rejectWithValue },
  ) => {
    try {
      const payload = { status };
      if (refundReason) payload.refundReason = refundReason;
      if (refusalReason) payload.refusalReason = refusalReason;
      const response = await apiClient.put(`/orders/${orderId}`, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteOrderThunk = createAsyncThunk(
  "data/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  status: "idle",
  error: null,
  products: loadFromStorage("products", initialProducts).map((p) => {
    const formattedColors = Array.isArray(p.colors)
      ? p.colors.map((c) =>
          typeof c === "string"
            ? { nameEn: c, nameAr: c, hex: "", image: "", price: null }
            : c,
        )
      : [];
    const formattedSizes = Array.isArray(p.sizes)
      ? p.sizes.map((s) =>
          typeof s === "string" ? { name: s, priceAdjustment: 0 } : s,
        )
      : [];

    let variantsStock = p.variantsStock || {};
    if (Object.keys(variantsStock).length === 0) {
      const stock = {};
      const colors =
        formattedColors.length > 0 ? formattedColors : [{ nameEn: "Default" }];
      const sizes =
        formattedSizes.length > 0 ? formattedSizes : [{ name: "Free Size" }];

      colors.forEach((c) => {
        const cName = c.nameEn || c.name || "Default";
        sizes.forEach((s) => {
          const sName = s.name || "Free Size";
          stock[`${cName}-${sName}`] = Math.floor(Math.random() * 15) + 1;
        });
      });
      variantsStock = stock;
    }

    return {
      ...p,
      colors: formattedColors,
      sizes: formattedSizes,
      variantsStock,
    };
  }),
  categories: loadFromStorage("categories", initialCategories),
  heroSlides: loadFromStorage("heroSlides", initialHeroSlides),
  leftSideCards: loadFromStorage("leftSideCards", initialLeftSideCards),
  rightSideCards: loadFromStorage("rightSideCards", initialRightSideCards),
  orders: loadFromStorage("orders", []),
  offers: loadFromStorage("offers", [
    {
      id: 1,
      titleEn: "Summer Flash Sale",
      titleAr: "عرض الصيف الخاص",
      discountEn: "30% OFF",
      discountAr: "خصم 30%",
      code: "SUMMER30",
    },
    {
      id: 2,
      titleEn: "New Customer Deal",
      titleAr: "عرض العميل الجديد",
      discountEn: "15% OFF",
      discountAr: "خصم 15%",
      code: "WELCOME15",
    },
  ]),
  paymentMethods: loadFromStorage("paymentMethods", [
    {
      id: 1,
      nameEn: "InstaPay",
      nameAr: "إنستاباي",
      detailsEn: "Transfer to: instapay.me/store or 01012345678",
      detailsAr: "تحويل إلى: instapay.me/store أو 01012345678",
      img: "/images/InstaPay.webp",
    },
    {
      id: 2,
      nameEn: "Vodafone Cash",
      nameAr: "فودافون كاش",
      detailsEn: "Transfer to: 01012345678",
      detailsAr: "تحويل إلى: 01012345678",
      img: "/images/VodafoneCash.png",
    },
    {
      id: 3,
      nameEn: "Cash on Delivery",
      nameAr: "الدفع عند الاستلام",
      detailsEn: "Pay to courier upon delivery",
      detailsAr: "الدفع للمندوب عند الاستلام",
      img: "/images/CashOnDelivery.png",
    },
  ]).map((pm) => ({
    ...pm,
    nameEn: pm.nameEn || pm.name || "",
    nameAr: pm.nameAr || pm.name || "",
    detailsEn: pm.detailsEn || pm.details || "",
    detailsAr: pm.detailsAr || pm.details || "",
  })),
  shippingRates: loadFromStorage("shippingRates", [
    { id: 1, governmentEn: "Cairo", governmentAr: "القاهرة", price: 50 },
    {
      id: 2,
      governmentEn: "Alexandria",
      governmentAr: "الإسكندرية",
      price: 60,
    },
    { id: 3, governmentEn: "Giza", governmentAr: "الجيزة", price: 50 },
  ]).map((sr) => ({
    ...sr,
    governmentEn: sr.governmentEn || sr.government || "",
    governmentAr: sr.governmentAr || sr.government || "",
  })),
  announcements: loadFromStorage("announcements", [
    {
      id: 1,
      textEn: "Free Shipping On Orders Over 500 EGP",
      textAr: "شحن مجاني للطلبات أكثر من 500 ج.م",
      isActive: true,
    },
  ]),
  freeShipping: loadFromStorage("freeShipping", {
    enabled: true,
    threshold: 500,
  }),
  siteSettings: loadFromStorage("siteSettings", {
    type: "text",
    logoUrl: "/images/SHEIN.png",
    siteName: "SHEIN EG",
    socialLinks: {
      facebook: "",
      instagram: "",
      tiktok: "",
      youtube: "",
    },
  }),
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    // ─── Products ────────────────────────────────────────────
    addReview(state, action) {
      const { productId, review } = action.payload;
      const product = state.products.find(
        (p) => String(p.id) === String(productId),
      );
      if (product) {
        if (!product.reviews) {
          product.reviews = [];
        }
        product.reviews.push(review);
        product.reviewsCount = product.reviews.length;
      }
    },

    removeReview(state, action) {
      const { productId, reviewId } = action.payload;
      const product = state.products.find(
        (p) => String(p.id) === String(productId),
      );
      if (product && product.reviews) {
        product.reviews = product.reviews.filter(
          (r) => String(r.id) !== String(reviewId),
        );
        product.reviewsCount = product.reviews.length;
      }
    },

    editReview(state, action) {
      const { productId, reviewId, rating, comment } = action.payload;
      const product = state.products.find(
        (p) => String(p.id) === String(productId),
      );
      if (product && product.reviews) {
        const review = product.reviews.find(
          (r) => String(r.id) === String(reviewId),
        );
        if (review) {
          review.rating = rating;
          review.comment = comment;
        }
      }
    },

    // ─── Hero Slides ─────────────────────────────────────────
    setHeroSlides(state, action) {
      state.heroSlides = action.payload;
    },

    addHeroSlide(state, action) {
      state.heroSlides.push(action.payload);
    },

    removeHeroSlide(state, action) {
      state.heroSlides.splice(action.payload, 1);
    },

    updateLeftSideCard(state, action) {
      const { index, card } = action.payload;
      if (state.leftSideCards[index]) {
        state.leftSideCards[index] = card;
      }
    },

    updateRightSideCard(state, action) {
      const { index, card } = action.payload;
      if (state.rightSideCards[index]) {
        state.rightSideCards[index] = card;
      }
    },

    // ─── Offers ──────────────────────────────────────────────
    addOffer(state, action) {
      state.offers.push(action.payload);
    },

    updateOffer(state, action) {
      const index = state.offers.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      }
    },

    removeOffer(state, action) {
      state.offers = state.offers.filter((o) => o.id !== action.payload);
    },

    // ─── Payment Methods ─────────────────────────────────────
    addPaymentMethod(state, action) {
      state.paymentMethods.push(action.payload);
    },

    updatePaymentMethod(state, action) {
      const index = state.paymentMethods.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (index !== -1) {
        state.paymentMethods[index] = action.payload;
      }
    },

    removePaymentMethod(state, action) {
      state.paymentMethods = state.paymentMethods.filter(
        (p) => p.id !== action.payload,
      );
    },

    // ─── Shipping Rates ──────────────────────────────────────
    addShippingRate(state, action) {
      state.shippingRates.push(action.payload);
    },

    updateShippingRate(state, action) {
      const index = state.shippingRates.findIndex(
        (s) => s.id === action.payload.id,
      );
      if (index !== -1) {
        state.shippingRates[index] = action.payload;
      }
    },

    removeShippingRate(state, action) {
      state.shippingRates = state.shippingRates.filter(
        (s) => s.id !== action.payload,
      );
    },

    // ─── Announcements ────────────────────────────────────────
    addAnnouncement(state, action) {
      state.announcements.unshift(action.payload);
    },
    updateAnnouncement(state, action) {
      const index = state.announcements.findIndex(
        (a) => String(a.id) === String(action.payload.id),
      );
      if (index !== -1) {
        state.announcements[index] = {
          ...state.announcements[index],
          ...action.payload,
        };
      }
    },
    removeAnnouncement(state, action) {
      state.announcements = state.announcements.filter(
        (a) => String(a.id) !== String(action.payload),
      );
    },

    // ─── Free Shipping ───────────────────────────────────────
    updateFreeShipping(state, action) {
      state.freeShipping = { ...state.freeShipping, ...action.payload };
    },

    // ─── Site Settings ───────────────────────────────────────
    updateSiteSettings(state, action) {
      state.siteSettings = { ...state.siteSettings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // fetchProductsThunk
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // createProductThunk
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // updateProductThunk
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => String(p.id) === String(action.payload.id),
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // deleteProductThunk
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => String(p.id) !== String(action.payload),
        );
      })

      // fetchCategoriesThunk
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // createCategoryThunk
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // updateCategoryThunk
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => String(c.id) === String(action.payload.id),
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // deleteCategoryThunk
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => String(c.id) !== String(action.payload),
        );
      })

      // fetchOrdersThunk
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // createOrderThunk
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      // updateOrderStatusThunk
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => String(o.id) === String(action.payload.id),
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // deleteOrderThunk
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (o) => String(o.id) !== String(action.payload),
        );
      });
  },
});

export const {
  addReview,
  removeReview,
  editReview,
  addCategory,
  updateCategory,
  deleteCategory,
  addOrder,
  updateOrderStatus,
  setHeroSlides,
  addHeroSlide,
  removeHeroSlide,
  updateLeftSideCard,
  updateRightSideCard,
  addOffer,
  updateOffer,
  removeOffer,
  addPaymentMethod,
  updatePaymentMethod,
  removePaymentMethod,
  addShippingRate,
  updateShippingRate,
  removeShippingRate,
  addAnnouncement,
  updateAnnouncement,
  removeAnnouncement,
  updateFreeShipping,
  updateSiteSettings,
} = dataSlice.actions;

// Selectors
export const selectProducts = (state) => state.data.products || [];
export const selectCategories = (state) => state.data.categories || [];
export const selectHeroSlides = (state) => state.data.heroSlides || [];
export const selectLeftSideCards = (state) => state.data.leftSideCards || [];
export const selectRightSideCards = (state) => state.data.rightSideCards || [];
export const selectOrders = (state) => state.data.orders || [];
export const selectOffers = (state) => state.data.offers || [];
export const selectPaymentMethods = (state) => state.data.paymentMethods || [];
export const selectShippingRates = (state) => state.data.shippingRates || [];
export const selectAnnouncements = (state) => state.data.announcements || [];
export const selectFreeShipping = (state) =>
  state.data.freeShipping || { enabled: false, threshold: 0 };
export const selectSiteSettings = (state) => state.data.siteSettings || {};

export const selectTopSellingProducts = createSelector(
  [selectOrders, selectProducts],
  (orders, products) => {
    const qtyMap = {};
    (orders || []).forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          qtyMap[item.id] = (qtyMap[item.id] || 0) + item.quantity;
        });
      }
    });

    return [...(products || [])]
      .sort((a, b) => (qtyMap[b.id] || 0) - (qtyMap[a.id] || 0))
      .slice(0, 4);
  },
);

export const dataReducer = dataSlice.reducer;
