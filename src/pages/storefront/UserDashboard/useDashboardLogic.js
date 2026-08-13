import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectUser,
  selectIsLoggedIn,
  selectProfileStatus,
  selectPasswordStatus,
  fetchProfileThunk,
  updateProfileThunk,
  changePasswordThunk,
  fetchAddressesThunk,
  createAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
} from "../../../store/authSlice";
import {
  fetchMyOrdersThunk,
  selectMyOrders,
  selectShippingRates,
} from "../../../store/dataSlice";
import { features } from "../../../config/features";

export const useDashboardLogic = () => {
  const { t } = useTranslation("storefront");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const orders = useSelector(selectMyOrders);
  const shippingRates = useSelector(selectShippingRates);
  const profileStatus = useSelector(selectProfileStatus);
  const passwordStatus = useSelector(selectPasswordStatus);

  const [activeTab, setActiveTab] = useState("orders");
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [refundOrderId, setRefundOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phoneNumber || "");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setOrdersLoading(false);
      return;
    }

    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError(null);

    dispatch(fetchMyOrdersThunk())
      .unwrap()
      .then(() => {
        if (!cancelled) setOrdersError(null);
      })
      .catch((err) => {
        if (!cancelled) setOrdersError(err || t("failedToLoadOrders"));
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    if (features.profileEdit) dispatch(fetchProfileThunk());
    if (features.savedAddresses) dispatch(fetchAddressesThunk());

    return () => {
      cancelled = true;
    };
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.name || user.fullName || "");
    setProfilePhone(user.phoneNumber || "");
  }, [user]);

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
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!features.profileEdit) return;
    setSaveMessage("");
    setSaveError("");
    try {
      await dispatch(
        updateProfileThunk({
          fullName: profileName,
          phoneNumber: profilePhone,
        }),
      ).unwrap();
      setSaveMessage(t("profileUpdated"));
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveError(error || t("failedToUpdateProfile"));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    try {
      await dispatch(
        changePasswordThunk({ currentPassword, newPassword }),
      ).unwrap();
      setPasswordMessage(t("passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (error) {
      setPasswordError(error || t("failedToChangePassword"));
    }
  };

  const onSaveAddress = async (address) => {
    if (!features.savedAddresses) return;
    if (editingAddress?.id) {
      await dispatch(updateAddressThunk({ id: editingAddress.id, ...address }));
    } else {
      await dispatch(createAddressThunk(address));
    }
  };

  const handleEditAddressClick = (addr) => {
    setEditingAddress(addr);
    setShowAddressModal(true);
  };

  const handleAddNewAddressClick = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (id) => {
    dispatch(deleteAddressThunk(id));
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddressThunk(id));
  };

  const refreshOrders = () => {
    setOrdersLoading(true);
    setOrdersError(null);
    dispatch(fetchMyOrdersThunk())
      .unwrap()
      .then(() => setOrdersError(null))
      .catch((err) => setOrdersError(err || t("failedToLoadOrders")))
      .finally(() => setOrdersLoading(false));
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
    ordersLoading,
    ordersError,
    refreshOrders,
    profileName,
    setProfileName,
    profilePhone,
    setProfilePhone,
    profileEmail: user?.email || "",
    saveMessage,
    saveError,
    handleUpdateProfile,
    profileStatus,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    passwordMessage,
    passwordError,
    handleChangePassword,
    passwordStatus,
    showAddressModal,
    setShowAddressModal,
    editingAddress,
    onSaveAddress,
    handleEditAddressClick,
    handleAddNewAddressClick,
    handleDeleteAddress,
    handleSetDefault,
  };
};
