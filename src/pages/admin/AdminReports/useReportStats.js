import { useMemo, useState, useRef, useEffect } from "react";

const itemProductId = (item) => item?.productId ?? item?.id ?? null;

const itemUnitPrice = (item, catalogProduct) => {
  const fromItem = Number(item?.unitPrice ?? item?.price);
  if (Number.isFinite(fromItem) && fromItem > 0) return fromItem;
  const fromCatalog = Number(catalogProduct?.price);
  return Number.isFinite(fromCatalog) ? fromCatalog : 0;
};

const itemImage = (item, catalogProduct) =>
  item?.imageUrl ||
  item?.img ||
  catalogProduct?.img ||
  catalogProduct?.imageUrl ||
  catalogProduct?.images?.[0] ||
  "";

const itemName = (item, catalogProduct) =>
  item?.nameEn ||
  item?.name ||
  catalogProduct?.nameEn ||
  catalogProduct?.name ||
  "Unknown";

export const useReportStats = (orders, products) => {
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [filterProductId, setFilterProductId] = useState("all");

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const productsById = useMemo(() => {
    const map = new Map();
    products.forEach((product) => map.set(String(product.id), product));
    return map;
  }, [products]);

  const filteredProductsForSearch = useMemo(() => {
    return products.filter((p) => {
      const pNameEn = (p.nameEn || p.name || "").toLowerCase();
      const pNameAr = (p.nameAr || p.name || "").toLowerCase();
      const searchTarget = (productSearch || "").toLowerCase();
      return pNameEn.includes(searchTarget) || pNameAr.includes(searchTarget);
    });
  }, [products, productSearch]);

  const selectedProduct = products.find(
    (p) => String(p.id) === String(filterProductId),
  );

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalSales = 0;
    let totalShipping = 0;
    let totalOrders = 0;
    let totalItemsSold = 0;
    let totalDiscounts = 0;
    let ordersWithDiscount = 0;

    let dailyRevenue = 0;
    let monthlyRevenue = 0;
    let yearlyRevenue = 0;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const todayStr = today.toLocaleDateString();

    const productSales = {};

    orders.forEach((order) => {
      let orderDate = new Date(order.createdAt || order.date);
      if (Number.isNaN(orderDate.getTime())) {
        orderDate = new Date();
      }

      const oMonth = orderDate.getMonth().toString();
      const oYear = orderDate.getFullYear().toString();

      if (filterMonth !== "all" && filterMonth !== oMonth) return;
      if (filterYear !== "all" && filterYear !== oYear) return;
      if (order.status === "Refunded" || order.status === "Cancelled") return;

      let orderRevenue = 0;
      let orderItemsCount = 0;
      let validForOrder = false;

      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const productId = itemProductId(item);
          if (productId == null) return;

          if (
            filterProductId !== "all" &&
            String(productId) !== String(filterProductId)
          ) {
            return;
          }

          const catalogProduct = productsById.get(String(productId));
          const unitPrice = itemUnitPrice(item, catalogProduct);
          const quantity = Number(item.quantity) || 0;

          validForOrder = true;
          const itemRev = unitPrice * quantity;
          orderRevenue += itemRev;
          orderItemsCount += quantity;

          const key = String(productId);
          if (productSales[key]) {
            productSales[key].quantity += quantity;
            productSales[key].revenue += itemRev;
          } else {
            productSales[key] = {
              id: productId,
              name: itemName(item, catalogProduct),
              img: itemImage(item, catalogProduct),
              quantity,
              revenue: itemRev,
            };
          }
        });
      }

      if (validForOrder) {
        const netOrderRevenue =
          order.subtotal !== undefined && order.discount !== undefined
            ? Math.max(0, order.subtotal - order.discount)
            : Math.max(0, (order.total || 0) - (order.shippingCost || 0));

        const finalRevenueToAdd =
          filterProductId === "all" ? netOrderRevenue : orderRevenue;

        totalRevenue += finalRevenueToAdd;
        totalOrders += 1;
        totalItemsSold += orderItemsCount;
        totalSales += order.total || 0;
        totalShipping += order.shippingCost || 0;

        if (order.discount && order.discount > 0) {
          totalDiscounts += order.discount;
          ordersWithDiscount += 1;
        }

        const orderDayStr = orderDate.toLocaleDateString();
        if (orderDayStr === todayStr) {
          dailyRevenue += finalRevenueToAdd;
        }
        if (
          oMonth === currentMonth.toString() &&
          oYear === currentYear.toString()
        ) {
          monthlyRevenue += finalRevenueToAdd;
        }
        if (oYear === currentYear.toString()) {
          yearlyRevenue += finalRevenueToAdd;
        }
      }
    });

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const maxTimeRevenue =
      Math.max(dailyRevenue, monthlyRevenue, yearlyRevenue) || 1;

    const maxProductQty = topProducts.length > 0 ? topProducts[0].quantity : 1;

    return {
      totalRevenue,
      totalSales,
      totalShipping,
      totalOrders,
      totalItemsSold,
      averageOrderValue,
      totalDiscounts,
      ordersWithDiscount,
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      topProducts,
      maxTimeRevenue,
      maxProductQty,
    };
  }, [orders, productsById, filterMonth, filterYear, filterProductId]);

  return {
    filterMonth,
    setFilterMonth,
    filterYear,
    setFilterYear,
    filterProductId,
    setFilterProductId,
    isProductDropdownOpen,
    setIsProductDropdownOpen,
    productSearch,
    setProductSearch,
    dropdownRef,
    filteredProductsForSearch,
    selectedProduct,
    stats,
  };
};
