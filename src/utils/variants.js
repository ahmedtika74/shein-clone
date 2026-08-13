/**
 * A product variant is the pairing of one colour and one size. The backend
 * keys `variantsStock` by `"<colour nameEn>-<size name>"`, so every place that
 * resolves a price, an image or a stock level has to agree on that key.
 */

const DEFAULT_COLOR = {
  nameEn: "Default",
  nameAr: "Default",
  hex: "#000000",
  imageUrl: "",
  price: null,
};

const DEFAULT_SIZE = { name: "Free Size", priceAdjustment: 0 };

export const resolveColor = (product, color) =>
  color ?? product?.colors?.[0] ?? DEFAULT_COLOR;

export const resolveSize = (product, size) =>
  size ?? product?.sizes?.[0] ?? DEFAULT_SIZE;

export const getVariantKey = (color, size) => {
  const colorName = color?.nameEn || color?.name || DEFAULT_COLOR.nameEn;
  const sizeName = size?.name || DEFAULT_SIZE.name;
  return `${colorName}-${sizeName}`;
};

export const getVariantPrice = (product, color, size) =>
  (color?.price ?? product?.price ?? 0) + (size?.priceAdjustment ?? 0);

export const getVariantOldPrice = (product, size) =>
  product?.oldPrice == null
    ? null
    : product.oldPrice + (size?.priceAdjustment ?? 0);

export const getVariantStock = (product, color, size) => {
  const stock = product?.variantsStock?.[getVariantKey(color, size)];
  return Number.isFinite(Number(stock)) ? Number(stock) : 0;
};

export const getTotalStock = (product) =>
  Object.values(product?.variantsStock ?? {}).reduce(
    (sum, quantity) => sum + (Number(quantity) || 0),
    0,
  );

/** Prefer the first colour/size pair that still has stock (falls back to defaults). */
export const findFirstInStockVariant = (product) => {
  const colors = product?.colors?.length ? product.colors : [DEFAULT_COLOR];
  const sizes = product?.sizes?.length ? product.sizes : [DEFAULT_SIZE];

  for (const color of colors) {
    for (const size of sizes) {
      if (getVariantStock(product, color, size) > 0) {
        return { color, size };
      }
    }
  }

  return {
    color: resolveColor(product, null),
    size: resolveSize(product, null),
  };
};

export const getVariantImage = (product, color) =>
  color?.imageUrl || product?.img || product?.images?.[0] || "";
