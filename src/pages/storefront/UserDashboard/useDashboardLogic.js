import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectIsLoggedIn,
  updateProfile,
} from "../../../store/authSlice";
import { selectOrders, selectShippingRates } from "../../../store/dataSlice";

export const useDashboardLogic = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const orders = useSelector(selectOrders);
  const shippingRates = useSelector(selectShippingRates);

  const [activeTab, setActiveTab] = useState("orders");
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [refundOrderId, setRefundOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

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
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(
    user?.address || {
      street: "",
      city: "",
      government: "",
      phone: "",
    },
  );
  const [saveMessage, setSaveMessage] = useState("");

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        name: profileName,
        email: profileEmail,
        address,
      }),
    );
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return {
    dispatch,
    user,
    isLoggedIn,
    shippingRates,
    activeTab,
    setActiveTab,
    cancelOrderId,
    setCancelOrderId,
    refundOrderId,
    setRefundOrderId,
    filterStatus,
    setFilterStatus: handleFilterChange,
    filteredOrders: paginatedOrders,
    currentPage,
    setCurrentPage,
    totalPages,
    profileName,
    setProfileName,
    profileEmail,
    setProfileEmail,
    address,
    setAddress,
    saveMessage,
    handleUpdateProfile,
  };
};
