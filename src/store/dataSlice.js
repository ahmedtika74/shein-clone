import {
  createSlice,
  createSelector,
  createAsyncThunk,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import {
  apiClient,
  toList,
  getApiErrorMessage,
  ALL_ITEMS_PAGE_SIZE,
} from "../services/apiClient";
import {
  toAnnouncementPayload,
  toAboutPage,
  toAboutPagePayload,
  emptyAboutPage,
  toReturnsPage,
  toReturnsPagePayload,
  emptyReturnsPage,
  toCategory,
  toCategoryPayload,
  toFreeShippingPayload,
  toHeroBannerPayload,
  toOffer,
  toOfferPayload,
  toOrder,
  toPaymentMethodPayload,
  toProduct,
  toProductPayload,
  toContactMessage,
  toContactMessagePayload,
  toReview,
  toReviewPayload,
  toShippingRatePayload,
  toSideCardPayload,
  toSiteSettings,
  toSiteSettingsPayload,
} from "../services/mappers";

const identity = (value) => value;
const pagedParams = { PageNumber: 1, PageSize: ALL_ITEMS_PAGE_SIZE };

/**
 * Builds the four CRUD thunks a collection needs.
 *
 * Writes re-fetch the collection instead of splicing the response into state:
 * the API's create/update responses are not guaranteed to echo the full entity,
 * and a refetch keeps the list authoritative for free.
 */
const createCrudThunks = (name, basePath, options = {}) => {
  const {
    mapItem = identity,
    toPayload = identity,
    params,
    listPath = basePath,
  } = options;

  const run = async (work, rejectWithValue) => {
    try {
      return await work();
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  };

  const thunks = {
    fetchAll: createAsyncThunk(`data/fetch${name}`, (_, { rejectWithValue }) =>
      run(async () => {
        const data = await apiClient.get(listPath, { params });
        return toList(data).map(mapItem);
      }, rejectWithValue),
    ),

    create: createAsyncThunk(
      `data/create${name}`,
      (form, { dispatch, rejectWithValue }) =>
        run(async () => {
          const created = await apiClient.post(basePath, toPayload(form));
          await dispatch(thunks.fetchAll());
          return created;
        }, rejectWithValue),
    ),

    update: createAsyncThunk(
      `data/update${name}`,
      ({ id, ...form }, { dispatch, rejectWithValue }) =>
        run(async () => {
          const updated = await apiClient.put(
            `${basePath}/${id}`,
            toPayload(form),
          );
          await dispatch(thunks.fetchAll());
          return updated;
        }, rejectWithValue),
    ),

    remove: createAsyncThunk(
      `data/delete${name}`,
      (id, { dispatch, rejectWithValue }) =>
        run(async () => {
          await apiClient.delete(`${basePath}/${id}`);
          await dispatch(thunks.fetchAll());
          return id;
        }, rejectWithValue),
    ),
  };

  return thunks;
};

const products = createCrudThunks("Products", "/products", {
  mapItem: toProduct,
  toPayload: toProductPayload,
  params: pagedParams,
});

// `/categories/all` is the unpaged variant; the paged list caps at ~10 rows.
const categories = createCrudThunks("Categories", "/categories", {
  mapItem: toCategory,
  toPayload: toCategoryPayload,
  listPath: "/categories/all",
});

const offers = createCrudThunks("Offers", "/offers", {
  mapItem: toOffer,
  toPayload: toOfferPayload,
  params: pagedParams,
});

const paymentMethods = createCrudThunks("PaymentMethods", "/payment-methods", {
  toPayload: toPaymentMethodPayload,
});

const shippingRates = createCrudThunks("ShippingRates", "/shipping-rates", {
  toPayload: toShippingRatePayload,
});

const announcements = createCrudThunks("Announcements", "/announcements", {
  toPayload: toAnnouncementPayload,
});

const heroBanners = createCrudThunks("HeroBanners", "/hero-banners", {
  toPayload: toHeroBannerPayload,
});

export const fetchProductsThunk = products.fetchAll;
export const createProductThunk = products.create;
export const updateProductThunk = products.update;
export const deleteProductThunk = products.remove;

export const fetchCategoriesThunk = categories.fetchAll;
export const createCategoryThunk = categories.create;
export const updateCategoryThunk = categories.update;
export const deleteCategoryThunk = categories.remove;

export const fetchOffersThunk = offers.fetchAll;
export const createOfferThunk = offers.create;
export const updateOfferThunk = offers.update;
export const deleteOfferThunk = offers.remove;

export const fetchPaymentMethodsThunk = paymentMethods.fetchAll;
export const createPaymentMethodThunk = paymentMethods.create;
export const updatePaymentMethodThunk = paymentMethods.update;
export const deletePaymentMethodThunk = paymentMethods.remove;

export const fetchShippingRatesThunk = shippingRates.fetchAll;
export const createShippingRateThunk = shippingRates.create;
export const updateShippingRateThunk = shippingRates.update;
export const deleteShippingRateThunk = shippingRates.remove;

export const fetchAnnouncementsThunk = announcements.fetchAll;
export const createAnnouncementThunk = announcements.create;
export const updateAnnouncementThunk = announcements.update;
export const deleteAnnouncementThunk = announcements.remove;

export const fetchHeroBannersThunk = heroBanners.fetchAll;
export const createHeroBannerThunk = heroBanners.create;
export const updateHeroBannerThunk = heroBanners.update;
export const deleteHeroBannerThunk = heroBanners.remove;

const withErrorMessage =
  (work) =>
  async (arg, { rejectWithValue }) => {
    try {
      return await work(arg);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  };

export const fetchOrdersThunk = createAsyncThunk(
  "data/fetchOrders",
  withErrorMessage(async () =>
    toList(await apiClient.get("/orders", { params: pagedParams })).map(
      toOrder,
    ),
  ),
);

export const fetchMyOrdersThunk = createAsyncThunk(
  "data/fetchMyOrders",
  withErrorMessage(async (arg = {}) => {
    const { status, pageNumber = 1, pageSize = ALL_ITEMS_PAGE_SIZE } =
      typeof arg === "object" && arg !== null ? arg : {};
    const params = {
      PageNumber: pageNumber,
      PageSize: pageSize,
    };
    if (status && status !== "ALL") params.status = status;

    return toList(await apiClient.get("/orders/mine", { params })).map(toOrder);
  }),
);

export const createOrderThunk = createAsyncThunk(
  "data/createOrder",
  withErrorMessage(async (payload) => apiClient.post("/orders", payload)),
);

export const requestRefundThunk = createAsyncThunk(
  "data/requestRefund",
  withErrorMessage(async ({ orderId, reason }) => {
    await apiClient.post(`/orders/${orderId}/refund-request`, { reason });
    // Confirm server status after the request (some APIs only set refundReason).
    try {
      const mine = toList(
        await apiClient.get("/orders/mine", {
          params: { PageNumber: 1, PageSize: ALL_ITEMS_PAGE_SIZE },
        }),
      ).map(toOrder);
      const updated = mine.find((o) => String(o.id) === String(orderId));
      return {
        orderId,
        reason,
        status: updated?.status || "Refund Requested",
        ordersMine: mine,
      };
    } catch {
      return { orderId, reason, status: "Refund Requested", ordersMine: null };
    }
  }),
);

export const updateOrderStatusThunk = createAsyncThunk(
  "data/updateOrderStatus",
  withErrorMessage(async ({ orderId, status, refundReason, refusalReason }) => {
    await apiClient.patch(`/orders/${orderId}/status`, {
      status,
      refundReason: refundReason ?? null,
      refusalReason: refusalReason ?? null,
    });
    return { orderId, status, refundReason, refusalReason };
  }),
);

export const fetchReviewsThunk = createAsyncThunk(
  "data/fetchReviews",
  withErrorMessage(async (productId) =>
    toList(await apiClient.get(`/products/${productId}/reviews`)).map(toReview),
  ),
);

export const createReviewThunk = createAsyncThunk(
  "data/createReview",
  withErrorMessage(async ({ productId, rating, comment }) => {
    await apiClient.post(
      `/products/${productId}/reviews`,
      toReviewPayload({ rating, comment }),
    );
    return {
      productId,
      reviews: toList(
        await apiClient.get(`/products/${productId}/reviews`),
      ).map(toReview),
    };
  }),
);

export const updateReviewThunk = createAsyncThunk(
  "data/updateReview",
  withErrorMessage(async ({ productId, reviewId, rating, comment }) => {
    await apiClient.put(
      `/products/${productId}/reviews/${reviewId}`,
      toReviewPayload({ rating, comment }),
    );
    return {
      productId,
      reviews: toList(
        await apiClient.get(`/products/${productId}/reviews`),
      ).map(toReview),
    };
  }),
);

export const deleteReviewThunk = createAsyncThunk(
  "data/deleteReview",
  withErrorMessage(async ({ productId, reviewId }) => {
    await apiClient.delete(`/products/${productId}/reviews/${reviewId}`);
    return { productId, reviewId };
  }),
);

export const deleteOrderThunk = createAsyncThunk(
  "data/deleteOrder",
  withErrorMessage(async (orderId) => {
    await apiClient.delete(`/orders/${orderId}`);
    return orderId;
  }),
);

export const fetchFreeShippingThunk = createAsyncThunk(
  "data/fetchFreeShipping",
  withErrorMessage(async () => apiClient.get("/shipping-rates/free-shipping")),
);

export const updateFreeShippingThunk = createAsyncThunk(
  "data/updateFreeShipping",
  withErrorMessage(async (settings) => {
    const payload = toFreeShippingPayload(settings);
    await apiClient.put("/shipping-rates/free-shipping", payload);
    return payload;
  }),
);

export const fetchSideCardsThunk = createAsyncThunk(
  "data/fetchSideCards",
  withErrorMessage(async () =>
    toList(await apiClient.get("/hero-banners/side-cards")),
  ),
);

export const updateSideCardThunk = createAsyncThunk(
  "data/updateSideCard",
  withErrorMessage(async ({ position, slot, card }) => {
    const slotNumber = Number(slot);
    await apiClient.put(
      `/hero-banners/side-cards/${position}/${slotNumber}`,
      toSideCardPayload(card),
    );
    // Refetch so sibling cards on the same side stay intact.
    return toList(await apiClient.get("/hero-banners/side-cards"));
  }),
);

export const fetchSiteSettingsThunk = createAsyncThunk(
  "data/fetchSiteSettings",
  withErrorMessage(async () => toSiteSettings(await apiClient.get("/settings"))),
);

export const updateSiteSettingsThunk = createAsyncThunk(
  "data/updateSiteSettings",
  withErrorMessage(async (settings) => {
    const payload = toSiteSettingsPayload(settings);
    await apiClient.put("/settings", payload);
    return toSiteSettings(payload);
  }),
);

export const fetchDashboardSummaryThunk = createAsyncThunk(
  "data/fetchDashboardSummary",
  withErrorMessage(async () => apiClient.get("/dashboard/summary")),
);

export const fetchRecentOrdersThunk = createAsyncThunk(
  "data/fetchRecentOrders",
  withErrorMessage(async (count = 5) =>
    toList(
      await apiClient.get("/dashboard/recent-orders", { params: { count } }),
    ).map(toOrder),
  ),
);

export const submitContactMessageThunk = createAsyncThunk(
  "data/submitContactMessage",
  withErrorMessage(async (form) =>
    toContactMessage(
      await apiClient.post("/contact-messages", toContactMessagePayload(form), {
        authScope: "none",
      }),
    ),
  ),
);

export const fetchContactMessagesThunk = createAsyncThunk(
  "data/fetchContactMessages",
  withErrorMessage(async (status) => {
    const params = { PageNumber: 1, PageSize: ALL_ITEMS_PAGE_SIZE };
    if (status && status !== "ALL") params.status = status;
    return toList(
      await apiClient.get("/contact-messages", { params, authScope: "admin" }),
    ).map(toContactMessage);
  }),
);

export const updateContactMessageStatusThunk = createAsyncThunk(
  "data/updateContactMessageStatus",
  withErrorMessage(async ({ id, status }) => {
    await apiClient.patch(
      `/contact-messages/${id}/status`,
      { status },
      { authScope: "admin" },
    );
    return { id, status };
  }),
);

export const deleteContactMessageThunk = createAsyncThunk(
  "data/deleteContactMessage",
  withErrorMessage(async (id) => {
    await apiClient.delete(`/contact-messages/${id}`, { authScope: "admin" });
    return id;
  }),
);

export const fetchAboutPageThunk = createAsyncThunk(
  "data/fetchAboutPage",
  withErrorMessage(async () =>
    toAboutPage(await apiClient.get("/about", { authScope: "none" })),
  ),
);

export const updateAboutPageThunk = createAsyncThunk(
  "data/updateAboutPage",
  withErrorMessage(async (form) => {
    const payload = toAboutPagePayload(form);
    await apiClient.put("/about", payload, { authScope: "admin" });
    return payload;
  }),
);

export const fetchReturnsPageThunk = createAsyncThunk(
  "data/fetchReturnsPage",
  withErrorMessage(async () =>
    toReturnsPage(await apiClient.get("/returns", { authScope: "none" })),
  ),
);

export const updateReturnsPageThunk = createAsyncThunk(
  "data/updateReturnsPage",
  withErrorMessage(async (form) => {
    const payload = toReturnsPagePayload(form);
    await apiClient.put("/returns", payload, { authScope: "admin" });
    return payload;
  }),
);

const emptySiteSettings = {
  logoUrl: "",
  siteName: "",
  type: "logo",
  displayMode: "logo",
  socialLinks: { facebook: "", instagram: "", tiktok: "", youtube: "" },
};

const initialState = {
  status: "idle",
  error: null,
  products: [],
  categories: [],
  heroSlides: [],
  leftSideCards: [],
  rightSideCards: [],
  orders: [],
  myOrders: [],
  reviewsByProduct: {},
  offers: [],
  paymentMethods: [],
  shippingRates: [],
  announcements: [],
  recentOrders: [],
  contactMessages: [],
  dashboardSummary: null,
  freeShipping: { enabled: false, threshold: 0 },
  siteSettings: emptySiteSettings,
  aboutPage: emptyAboutPage,
  returnsPage: emptyReturnsPage,
};

/** Collections that only need `state[key] = payload` on fulfilment. */
const collectionThunks = [
  [products.fetchAll, "products"],
  [fetchCategoriesThunk, "categories"],
  [fetchOrdersThunk, "orders"],
  [fetchMyOrdersThunk, "myOrders"],
  [offers.fetchAll, "offers"],
  [paymentMethods.fetchAll, "paymentMethods"],
  [shippingRates.fetchAll, "shippingRates"],
  [announcements.fetchAll, "announcements"],
  [heroBanners.fetchAll, "heroSlides"],
  [fetchRecentOrdersThunk, "recentOrders"],
];

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    collectionThunks.forEach(([thunk, key]) => {
      builder.addCase(thunk.fulfilled, (state, action) => {
        state[key] = action.payload;
      });
    });

    builder
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => String(order.id) !== String(action.payload),
        );
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const { orderId, status, refundReason, refusalReason } = action.payload;
        const now = new Date().toISOString();
        const patchOrder = (list) => {
          const order = list.find(
            (candidate) => String(candidate.id) === String(orderId),
          );
          if (order) {
            order.status = status;
            if (refundReason) order.refundReason = refundReason;
            if (refusalReason) order.refusalReason = refusalReason;
            if (status === "Refund Requested" && !order.refundRequestedAt) {
              order.refundRequestedAt = now;
            }
            if (status === "Refunded") {
              order.refundedAt = order.refundedAt || now;
            }
            if (status === "Refund Refused") {
              order.refusedAt = order.refusedAt || now;
            }
          }
        };
        patchOrder(state.orders);
        patchOrder(state.myOrders);
      })
      .addCase(requestRefundThunk.fulfilled, (state, action) => {
        const { orderId, reason, status, ordersMine } = action.payload;
        if (Array.isArray(ordersMine)) {
          state.myOrders = ordersMine;
        }
        const nextStatus = status || "Refund Requested";
        const now = new Date().toISOString();
        const patch = (list) => {
          const order = list.find(
            (candidate) => String(candidate.id) === String(orderId),
          );
          if (order) {
            // Keep Refund Requested even if a laggy read still returns Completed.
            order.status =
              nextStatus === "Completed" ? "Refund Requested" : nextStatus;
            order.refundReason = reason;
            order.refundRequestedAt = order.refundRequestedAt || now;
          }
        };
        patch(state.myOrders);
        patch(state.orders);
      })
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        state.reviewsByProduct[String(productId)] = action.payload;
      })
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        const { productId, reviews } = action.payload;
        state.reviewsByProduct[String(productId)] = reviews;
      })
      .addCase(updateReviewThunk.fulfilled, (state, action) => {
        const { productId, reviews } = action.payload;
        state.reviewsByProduct[String(productId)] = reviews;
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        const { productId, reviewId } = action.payload;
        const key = String(productId);
        state.reviewsByProduct[key] = (
          state.reviewsByProduct[key] ?? []
        ).filter((review) => String(review.id) !== String(reviewId));
      })
      .addCase(fetchSideCardsThunk.fulfilled, (state, action) => {
        const bySlot = (a, b) =>
          (Number(a.slot) || 0) - (Number(b.slot) || 0);
        state.leftSideCards = action.payload
          .filter((card) => card.position === "left")
          .sort(bySlot);
        state.rightSideCards = action.payload
          .filter((card) => card.position === "right")
          .sort(bySlot);
      })
      .addCase(updateSideCardThunk.fulfilled, (state, action) => {
        const bySlot = (a, b) =>
          (Number(a.slot) || 0) - (Number(b.slot) || 0);
        state.leftSideCards = action.payload
          .filter((card) => card.position === "left")
          .sort(bySlot);
        state.rightSideCards = action.payload
          .filter((card) => card.position === "right")
          .sort(bySlot);
      })
      .addCase(fetchFreeShippingThunk.fulfilled, (state, action) => {
        state.freeShipping = action.payload ?? initialState.freeShipping;
      })
      .addCase(updateFreeShippingThunk.fulfilled, (state, action) => {
        state.freeShipping = action.payload;
      })
      .addCase(fetchSiteSettingsThunk.fulfilled, (state, action) => {
        state.siteSettings = { ...emptySiteSettings, ...action.payload };
      })
      .addCase(updateSiteSettingsThunk.fulfilled, (state, action) => {
        state.siteSettings = { ...emptySiteSettings, ...action.payload };
      })
      .addCase(fetchDashboardSummaryThunk.fulfilled, (state, action) => {
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchContactMessagesThunk.fulfilled, (state, action) => {
        state.contactMessages = action.payload;
      })
      .addCase(updateContactMessageStatusThunk.fulfilled, (state, action) => {
        const message = state.contactMessages.find(
          (item) => String(item.id) === String(action.payload.id),
        );
        if (message) message.status = action.payload.status;
      })
      .addCase(deleteContactMessageThunk.fulfilled, (state, action) => {
        state.contactMessages = state.contactMessages.filter(
          (item) => String(item.id) !== String(action.payload),
        );
      })
      .addCase(fetchAboutPageThunk.fulfilled, (state, action) => {
        state.aboutPage = action.payload;
      })
      .addCase(updateAboutPageThunk.fulfilled, (state, action) => {
        state.aboutPage = { ...emptyAboutPage, ...action.payload };
      })
      .addCase(fetchReturnsPageThunk.fulfilled, (state, action) => {
        state.returnsPage = action.payload;
      })
      .addCase(updateReturnsPageThunk.fulfilled, (state, action) => {
        state.returnsPage = { ...emptyReturnsPage, ...action.payload };
      })
      .addMatcher(isPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message ?? null;
      })
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        },
      );
  },
});

export const selectDataStatus = (state) => state.data.status;
export const selectDataError = (state) => state.data.error;
export const selectProducts = (state) => state.data.products;
export const selectCategories = (state) => state.data.categories;
export const selectHeroSlides = (state) => state.data.heroSlides;
export const selectLeftSideCards = (state) => state.data.leftSideCards;
export const selectRightSideCards = (state) => state.data.rightSideCards;
export const selectOrders = (state) => state.data.orders;
export const selectMyOrders = (state) => state.data.myOrders;
export const selectReviewsByProductId = (productId) => (state) =>
  state.data.reviewsByProduct[String(productId)] ?? [];
export const selectOffers = (state) => state.data.offers;
export const selectPaymentMethods = (state) => state.data.paymentMethods;
export const selectShippingRates = (state) => state.data.shippingRates;
export const selectAnnouncements = (state) => state.data.announcements;
export const selectRecentOrders = (state) => state.data.recentOrders;
export const selectContactMessages = (state) => state.data.contactMessages;
export const selectDashboardSummary = (state) => state.data.dashboardSummary;
export const selectFreeShipping = (state) => state.data.freeShipping;
export const selectSiteSettings = (state) => state.data.siteSettings;
export const selectAboutPage = (state) => state.data.aboutPage;
export const selectReturnsPage = (state) => state.data.returnsPage;

export const selectTopSellingProducts = createSelector(
  [selectOrders, selectProducts],
  (orders, products) => {
    const soldQuantity = new Map();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = String(item.productId);
        soldQuantity.set(key, (soldQuantity.get(key) ?? 0) + item.quantity);
      });
    });

    const sold = (product) => soldQuantity.get(String(product.id)) ?? 0;

    return [...products].sort((a, b) => sold(b) - sold(a)).slice(0, 4);
  },
);

export const dataReducer = dataSlice.reducer;
