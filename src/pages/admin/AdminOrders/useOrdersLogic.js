import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectOrders,
  updateOrderStatusThunk,
  deleteOrderThunk,
} from "../../../store/dataSlice";

export const useOrdersLogic = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const status = useSelector((state) => state.data.status);
  const isLoading = status === "loading";

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState({});

  const ordersPerPage = 10;

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

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
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

  const handleUpdateStatus = (orderId, newStatus, reason = null) => {
    dispatch(
      updateOrderStatusThunk({
        orderId,
        status: newStatus,
        refusalReason: reason,
      }),
    );
  };

  const handleDeleteOrder = (orderId) => {
    dispatch(deleteOrderThunk(orderId));
  };

  return {
    orders,
    isLoading,
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
