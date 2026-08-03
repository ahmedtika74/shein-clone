export const updateStockOnOrder = (order, products) => {
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach((item) => {
      const productIndex = products.findIndex(
        (p) => String(p.id) === String(item.id),
      );
      if (productIndex !== -1) {
        const product = products[productIndex];
        const colorName = item.color?.name || item.color || "Default";
        const sizeName = item.size?.name || item.size || "Free Size";
        const variantKey = `${colorName}-${sizeName}`;

        if (!product.variantsStock) {
          product.variantsStock = {};
        }
        const currentStock = product.variantsStock[variantKey] || 0;
        product.variantsStock[variantKey] = Math.max(
          0,
          currentStock - (item.quantity || 1),
        );
      }
    });
  }
  return products;
};

export const restoreStockOnRefund = (order, products) => {
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach((item) => {
      const productIndex = products.findIndex(
        (p) => String(p.id) === String(item.id),
      );
      if (productIndex !== -1) {
        const product = products[productIndex];
        const colorName = item.color?.name || item.color || "Default";
        const sizeName = item.size?.name || item.size || "Free Size";
        const variantKey = `${colorName}-${sizeName}`;

        if (!product.variantsStock) product.variantsStock = {};
        const currentStock = product.variantsStock[variantKey] || 0;
        product.variantsStock[variantKey] = currentStock + (item.quantity || 1);
      }
    });
  }
  return products;
};

export const handleRefundStatusChange = (updated, oldOrder, products) => {
  let updatedProducts = products;

  if (
    updated.status === "Refund Requested" &&
    oldOrder.status !== "Refund Requested"
  ) {
    updated.refundRequestedAt = new Date().toISOString();
  }

  if (updated.status === "Refunded" && oldOrder.status !== "Refunded") {
    updated.refundedAt = new Date().toISOString();
    updated.refusedAt = null;
    updated.refusalReason = null;
    updatedProducts = restoreStockOnRefund(oldOrder, products);
  }

  if (
    updated.status === "Refund Refused" &&
    oldOrder.status !== "Refund Refused"
  ) {
    updated.refusedAt = new Date().toISOString();
    updated.refundedAt = null;
  }

  return { updated, updatedProducts };
};
