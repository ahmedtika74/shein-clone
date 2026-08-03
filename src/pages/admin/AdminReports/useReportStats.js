import { useMemo, useState, useRef, useEffect } from "react";

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

  const filteredProductsForSearch = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [products, productSearch]);

  const selectedProduct = products.find(
    (p) => p.id.toString() === filterProductId,
  );

  const stats = useMemo(() => {
    let totalRevenue = 0;
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
      let orderDate = new Date(order.date);
      if (isNaN(orderDate.getTime())) {
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
          if (
            filterProductId !== "all" &&
            item.id.toString() !== filterProductId
          )
            return;

          validForOrder = true;
          const itemRev = item.price * item.quantity;
          orderRevenue += itemRev;
          orderItemsCount += item.quantity;

          if (productSales[item.id]) {
            productSales[item.id].quantity += item.quantity;
            productSales[item.id].revenue += itemRev;
          } else {
            productSales[item.id] = {
              id: item.id,
              name: item.name,
              img: item.img,
              quantity: item.quantity,
              revenue: itemRev,
            };
          }
        });
      }

      if (validForOrder) {
        const netOrderRevenue =
          order.subtotal !== undefined && order.discount !== undefined
            ? Math.max(0, order.subtotal - order.discount)
            : Math.max(0, order.total - (order.shippingCost || 0));

        const finalRevenueToAdd =
          filterProductId === "all" ? netOrderRevenue : orderRevenue;

        totalRevenue += finalRevenueToAdd;
        totalOrders += 1;
        totalItemsSold += orderItemsCount;

        if (order.discount && order.discount > 0) {
          totalDiscounts += order.discount;
          ordersWithDiscount += 1;
        }

        if (order.date === todayStr) {
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
  }, [orders, filterMonth, filterYear, filterProductId]);

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
