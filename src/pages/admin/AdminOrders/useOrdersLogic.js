import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectOrders,
  fetchOrdersThunk,
  updateOrderStatusThunk,
  deleteOrderThunk,
} from "../../../store/dataSlice";

export const useOrdersLogic = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);

  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [actionError, setActionError] = useState("");

  const ordersPerPage = 10;

  const loadOrders = () => {
    setOrdersLoading(true);
    setLoadError("");
    return dispatch(fetchOrdersThunk())
      .unwrap()
      .then(() => setLoadError(""))
      .catch((err) => setLoadError(err || t("failedToLoadOrders")))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    let cancelled = false;

    setOrdersLoading(true);
    setLoadError("");
    dispatch(fetchOrdersThunk())
      .unwrap()
      .then(() => {
        if (!cancelled) setLoadError("");
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err || t("failedToLoadOrders"));
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const filteredOrders = [...orders]
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
      return timeB - timeA;
    })
    .filter((o) => {
      if (filterStatus === "ALL") return true;
      return (
        (o.status || "Pending").toUpperCase() === filterStatus.toUpperCase()
      );
    });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleUpdateStatus = async (orderId, newStatus, reason = null) => {
    setActionError("");
    try {
      await dispatch(
        updateOrderStatusThunk({
          orderId,
          status: newStatus,
          refusalReason: reason,
        }),
      ).unwrap();
    } catch (err) {
      setActionError(err || t("failedToUpdateOrderStatus"));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setActionError("");
    try {
      await dispatch(deleteOrderThunk(orderId)).unwrap();
    } catch (err) {
      setActionError(err || t("failedToDeleteOrder"));
    }
  };

  const refreshOrders = () => {
    setActionError("");
    loadOrders();
  };

  return {
    orders,
    isLoading: ordersLoading,
    error: actionError || loadError,
    refreshOrders,
    filterStatus,
    handleFilterChange,
    currentPage,
    setCurrentPage,
    expandedOrders,
    toggleExpand,
    currentOrders,
    filteredOrders,
    totalPages,
    handleUpdateStatus,
    handleDeleteOrder,
  };
};
