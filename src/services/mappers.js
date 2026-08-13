/**
 * Translation layer between the .NET DTOs and the shapes the UI works with.
 *
 * The UI model keeps prices as numbers (formatted at render time) and exposes
 * `img` as the resolved main image, so components never index into `imageUrls`.
 */

const toNumber = (value, fallback = 0) => {
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const toColor = (dto) => ({
  nameEn: dto?.nameEn ?? "",
  nameAr: dto?.nameAr ?? dto?.nameEn ?? "",
  hex: dto?.hex ?? "#000000",
  imageUrl: dto?.imageUrl ?? "",
  price: toNullableNumber(dto?.price),
});

const toSize = (dto) => ({
  name: dto?.name ?? "",
  priceAdjustment: toNumber(dto?.priceAdjustment),
});

export const toProduct = (dto) => {
  const images = Array.isArray(dto?.imageUrls)
    ? dto.imageUrls.filter(Boolean)
    : Array.isArray(dto?.images)
      ? dto.images.filter(Boolean)
      : [];
  const mainIndex = toNumber(dto?.mainImageIndex);
  const fallbackImage =
    dto?.imageUrl || dto?.img || dto?.mainImageUrl || images[mainIndex] || images[0] || "";

  return {
    id: dto?.id,
    nameEn: dto?.nameEn ?? "",
    nameAr: dto?.nameAr ?? "",
    descriptionEn: dto?.descriptionEn ?? "",
    descriptionAr: dto?.descriptionAr ?? "",
    price: toNumber(dto?.newPrice ?? dto?.price),
    oldPrice: toNullableNumber(dto?.oldPrice),
    categoryId: dto?.categoryId ?? null,
    categoryNameEn: dto?.categoryNameEn ?? "",
    categoryNameAr: dto?.categoryNameAr ?? "",
    offerId: dto?.offerId ?? null,
    offerBadge: dto?.offerBadge ?? "",
    images: images.length ? images : fallbackImage ? [fallbackImage] : [],
    mainIndex,
    img: images[mainIndex] ?? images[0] ?? fallbackImage,
    imageUrl: fallbackImage || images[mainIndex] || images[0] || "",
    colors: Array.isArray(dto?.colors) ? dto.colors.map(toColor) : [],
    sizes: Array.isArray(dto?.sizes) ? dto.sizes.map(toSize) : [],
    variantsStock: dto?.variantsStock ?? {},
    createdAt: dto?.createdAt ?? null,
  };
};

const toOptionalString = (value) => {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : null;
};

/** Matches ProductCreateDto / ProductUpdateDto. */
export const toProductPayload = (form) => {
  const categoryId = toNumber(form.categoryId, 0);
  const imageUrls = Array.isArray(form.images)
    ? form.images.map((url) => String(url || "").trim()).filter(Boolean)
    : [];
  const mainImageIndex = toNumber(form.mainIndex);
  const maxIndex = Math.max(imageUrls.length - 1, 0);

  return {
    nameEn: form.nameEn,
    nameAr: form.nameAr,
    descriptionEn: form.descriptionEn ?? "",
    descriptionAr: form.descriptionAr ?? "",
    newPrice: toNumber(form.price),
    oldPrice: toNullableNumber(form.oldPrice),
    // API requires a non-null int FK (validated in the product form before save).
    categoryId,
    offerId: toNullableNumber(form.offerId),
    offerBadge: form.offerBadge ?? "",
    mainImageIndex: imageUrls.length ? Math.min(mainImageIndex, maxIndex) : 0,
    imageUrls,
    colors: (form.colors ?? []).map((color) => ({
      nameEn: color.nameEn || "Default",
      nameAr: color.nameAr || color.nameEn || "Default",
      hex: color.hex || "#000000",
      // Keep null (not "") — empty strings have crashed the API update path.
      imageUrl: toOptionalString(color.imageUrl),
      price: toNullableNumber(color.price),
    })),
    sizes: (form.sizes ?? []).map((size) => ({
      name: size.name || "Free Size",
      priceAdjustment: toNumber(size.priceAdjustment),
    })),
    variantsStock: Object.fromEntries(
      Object.entries(form.variantsStock ?? {}).map(([key, value]) => [
        key,
        Math.max(0, Math.trunc(toNumber(value))),
      ]),
    ),
  };
};

export const toCategory = (dto) => ({
  id: dto?.id,
  nameEn: dto?.nameEn ?? "",
  nameAr: dto?.nameAr ?? "",
  imageUrl: dto?.imageUrl ?? "",
});

/** Matches CategoryCreateDto. */
export const toCategoryPayload = (form) => ({
  nameEn: form.nameEn,
  nameAr: form.nameAr,
  imageUrl: form.imageUrl ?? "",
});

export const toOffer = (dto) => ({
  id: dto?.id,
  titleEn: dto?.titleEn ?? "",
  titleAr: dto?.titleAr ?? "",
  discountEn: dto?.discountEn ?? "",
  discountAr: dto?.discountAr ?? "",
  discountValue: toNumber(dto?.discountValue),
  discountType: dto?.discountType ?? "%",
  code: dto?.code ?? "",
  expiryDate: dto?.expiryDate ?? null,
  isActive: dto?.isActive ?? true,
});

const toExpiryIso = (value) => {
  if (!value) return null;
  // Date inputs are YYYY-MM-DD; use end-of-day so expiry isn't "yesterday" in UTC.
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return new Date(`${value}T23:59:59.999`).toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

/** Matches OfferCreateDto / OfferUpdateDto. */
export const toOfferPayload = (form) => ({
  titleEn: form.titleEn ?? "",
  titleAr: form.titleAr ?? "",
  discountEn: form.discountEn ?? "",
  discountAr: form.discountAr ?? "",
  discountValue: toNumber(form.discountValue),
  discountType: form.discountType ?? "%",
  code: form.code ?? "",
  expiryDate: toExpiryIso(form.expiryDate),
  ...(form.isActive === undefined ? {} : { isActive: form.isActive }),
});

/** Matches AnnouncementCreateDto. */
export const toAnnouncementPayload = (form) => ({
  textEn: form.textEn ?? "",
  textAr: form.textAr ?? "",
  isActive: form.isActive ?? true,
});

/** Matches PaymentMethodCreateDto. */
export const toPaymentMethodPayload = (form) => ({
  nameEn: form.nameEn ?? "",
  nameAr: form.nameAr ?? "",
  detailsEn: form.detailsEn ?? "",
  detailsAr: form.detailsAr ?? "",
  imageUrl: form.imageUrl ?? "",
});

/** Matches ShippingRateCreateDto. */
export const toShippingRatePayload = (form) => ({
  governmentEn: form.governmentEn ?? "",
  governmentAr: form.governmentAr ?? "",
  price: toNumber(form.price),
  deliveryDays: String(form.deliveryDays ?? ""),
});

/** Matches FreeShippingDto. Both fields are required on every write. */
export const toFreeShippingPayload = (form) => ({
  enabled: Boolean(form.enabled),
  threshold: toNumber(form.threshold),
});

/** Matches HeroBannerCreateDto. */
export const toHeroBannerPayload = (form) => ({
  imageUrl: form.imageUrl ?? "",
  link: form.link ?? "",
});

/** Matches SideCardUpdateDto. */
export const toSideCardPayload = (form) => ({
  titleEn: form.titleEn ?? "",
  titleAr: form.titleAr ?? "",
  actionTextEn: form.actionTextEn ?? "",
  actionTextAr: form.actionTextAr ?? "",
  imageUrl: form.imageUrl ?? "",
  link: form.link ?? "",
});

/** Matches SiteSettingsDto. */
export const toSiteSettingsPayload = (form) => ({
  logoUrl: form.logoUrl ?? "",
  siteName: form.siteName ?? "",
  socialLinks: {
    facebook: form.socialLinks?.facebook ?? "",
    instagram: form.socialLinks?.instagram ?? "",
    tiktok: form.socialLinks?.tiktok ?? "",
    youtube: form.socialLinks?.youtube ?? "",
  },
});

/** Map API status variants (RefundRequested, refund_requested, …) to UI labels. */
export const normalizeOrderStatus = (status) => {
  if (status == null || status === "") return "Pending";
  const compact = String(status)
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const aliases = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
    canceled: "Cancelled",
    refundrequested: "Refund Requested",
    refundrefused: "Refund Refused",
    refunded: "Refunded",
    returned: "Refunded",
  };

  return aliases[compact] || String(status).trim();
};

const toOrderItem = (dto) => ({
  productId: dto?.productId ?? dto?.id ?? null,
  nameEn: dto?.nameEn ?? dto?.productNameEn ?? "",
  nameAr: dto?.nameAr ?? dto?.productNameAr ?? "",
  imageUrl: dto?.imageUrl ?? dto?.image ?? "",
  colorName: dto?.colorName ?? dto?.color ?? "",
  sizeName: dto?.sizeName ?? dto?.size ?? "",
  quantity: toNumber(dto?.quantity),
  // Read DTOs sometimes use `price` instead of create-DTO `unitPrice`.
  unitPrice: toNumber(
    dto?.unitPrice ?? dto?.price ?? dto?.unit_price ?? dto?.Price,
  ),
  originalPrice: toNullableNumber(dto?.originalPrice ?? dto?.oldPrice),
});

export const toOrder = (dto) => {
  const items = Array.isArray(dto?.items) ? dto.items.map(toOrderItem) : [];
  const subtotal = toNumber(
    dto?.subtotal ?? dto?.subTotal ?? dto?.itemsTotal ?? dto?.SubTotal,
  );
  const discount = toNumber(dto?.discount ?? dto?.Discount);
  const productDiscount = toNumber(
    dto?.productDiscount ?? dto?.ProductDiscount,
  );
  const shippingCost = toNumber(
    dto?.shippingCost ?? dto?.shipping ?? dto?.ShippingCost,
  );
  const itemsSum = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const mappedTotal = toNumber(
    dto?.total ??
      dto?.totalAmount ??
      dto?.totalPrice ??
      dto?.grandTotal ??
      dto?.orderTotal ??
      dto?.amount ??
      dto?.Total ??
      dto?.TotalAmount ??
      dto?.TotalPrice,
  );
  // Prefer API total; if missing/zero but line items have prices, derive it.
  const total =
    mappedTotal ||
    (itemsSum > 0
      ? Math.max(0, (subtotal || itemsSum) - discount - productDiscount) +
        shippingCost
      : 0);

  return {
    id: dto?.id,
    customerName: dto?.customerName ?? "",
    userEmail: dto?.userEmail ?? "",
    items,
    subtotal: subtotal || itemsSum,
    discount,
    productDiscount,
    promoCode: dto?.promoCode ?? null,
    shippingCost,
    total,
    address: dto?.address ?? null,
    paymentMethod: dto?.paymentMethod ?? "",
    transactionNumber: dto?.transactionNumber ?? null,
    transactionScreenshotUrl: dto?.transactionScreenshotUrl ?? null,
    status: normalizeOrderStatus(dto?.status),
    refundReason: dto?.refundReason ?? null,
    refusalReason: dto?.refusalReason ?? null,
    refundRequestedAt:
      dto?.refundRequestedAt ??
      dto?.refundRequestAt ??
      dto?.refundRequestedOn ??
      null,
    refundedAt:
      dto?.refundedAt ??
      dto?.refundAcceptedAt ??
      dto?.acceptedAt ??
      null,
    refusedAt:
      dto?.refusedAt ??
      dto?.refundRefusedAt ??
      dto?.refusalAt ??
      null,
    createdAt: dto?.createdAt ?? null,
  };
};

export const toAddress = (dto) => ({
  id: dto?.id,
  label: dto?.label ?? "",
  government: dto?.government ?? "",
  city: dto?.city ?? "",
  street: dto?.street ?? "",
  phone: dto?.phone ?? "",
  isDefault: Boolean(dto?.isDefault),
});

export const toAddressPayload = (form) => ({
  label: form.label ?? "",
  government: form.government ?? "",
  city: form.city ?? "",
  street: form.street ?? "",
  phone: form.phone ?? "",
  isDefault: Boolean(form.isDefault),
});

export const toProfile = (dto) => ({
  name: dto?.fullName ?? dto?.name ?? "",
  fullName: dto?.fullName ?? dto?.name ?? "",
  email: dto?.email ?? "",
  phoneNumber: dto?.phoneNumber ?? dto?.phone ?? "",
});

export const toProfilePayload = (form) => ({
  fullName: form.fullName ?? form.name ?? "",
  phoneNumber: form.phoneNumber ?? form.phone ?? "",
});

export const toReview = (dto) => ({
  id: dto?.id,
  productId: dto?.productId ?? null,
  userName: dto?.userName ?? dto?.fullName ?? dto?.userEmail ?? "User",
  userEmail: dto?.userEmail ?? "",
  rating: toNumber(dto?.rating),
  comment: dto?.comment ?? "",
  date: dto?.createdAt
    ? new Date(dto.createdAt).toLocaleDateString()
    : dto?.date ?? "",
  createdAt: dto?.createdAt ?? null,
  userId: dto?.userId ?? dto?.user?.id ?? null,
});

export const toReviewPayload = (form) => ({
  rating: toNumber(form.rating),
  comment: form.comment ?? "",
});

/** Matches OrderCreateDto. */
export const toOrderPayload = ({
  customerName,
  userEmail,
  cartItems,
  subtotal,
  discount,
  productDiscount,
  promoCode,
  shippingCost,
  total,
  address,
  paymentMethod,
  transactionNumber,
  transactionScreenshotUrl,
}) => ({
  customerName: customerName ?? "",
  userEmail: userEmail ?? "",
  items: (cartItems ?? []).map((item) => ({
    productId: toNumber(item.productId ?? item.id, 0) || null,
    colorName: item.colorName ?? "",
    sizeName: item.sizeName ?? "",
    quantity: toNumber(item.quantity),
    unitPrice: toNumber(item.price),
    originalPrice: toNullableNumber(item.originalPrice),
  })),
  subtotal: toNumber(subtotal),
  discount: toNumber(discount),
  productDiscount: toNumber(productDiscount),
  promoCode: promoCode || null,
  shippingCost: toNumber(shippingCost),
  total: toNumber(total),
  address: {
    label: address?.label ?? "",
    government: address?.government ?? "",
    city: address?.city ?? "",
    street: address?.street ?? "",
    phone: address?.phone ?? "",
  },
  paymentMethod: paymentMethod ?? "",
  transactionNumber: transactionNumber || null,
  transactionScreenshotUrl: transactionScreenshotUrl || null,
});
