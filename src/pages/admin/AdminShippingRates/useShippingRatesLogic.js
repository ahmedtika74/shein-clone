import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectShippingRates,
  createShippingRateThunk,
  deleteShippingRateThunk,
  updateShippingRateThunk,
  selectFreeShipping,
  updateFreeShippingThunk,
} from "../../../store/dataSlice";

export const useShippingRatesLogic = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const shippingRates = useSelector(selectShippingRates);
  const freeShipping = useSelector(selectFreeShipping) || {
    enabled: false,
    threshold: 0,
  };
  const status = useSelector((state) => state.data.status);
  const isLoading = status === "loading";

  const [fsThreshold, setFsThreshold] = useState(
    String(freeShipping.threshold ?? 0),
  );
  const [isSaved, setIsSaved] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setFsThreshold(String(freeShipping.threshold ?? 0));
  }, [freeShipping.threshold]);

  const saveFreeShipping = async ({ enabled, threshold }) => {
    setFormError("");
    try {
      await dispatch(
        updateFreeShippingThunk({
          enabled,
          threshold,
        }),
      ).unwrap();
      return true;
    } catch (err) {
      setFormError(err || t("failedToUpdateFreeShipping"));
      return false;
    }
  };

  const handleToggleFreeShipping = async () => {
    const threshold = Number(fsThreshold);
    await saveFreeShipping({
      enabled: !freeShipping.enabled,
      threshold: Number.isFinite(threshold) ? threshold : freeShipping.threshold,
    });
  };

  const handleSaveFsThreshold = async () => {
    const val = parseFloat(fsThreshold);
    if (Number.isNaN(val) || val < 0) {
      setFormError(t("enterValidThreshold"));
      return;
    }

    const ok = await saveFreeShipping({
      enabled: freeShipping.enabled,
      threshold: val,
    });
    if (ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const [govNameEn, setGovNameEn] = useState("");
  const [govNameAr, setGovNameAr] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");

  const resetAddForm = () => {
    setGovNameEn("");
    setGovNameAr("");
    setPrice("");
    setDeliveryDays("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !govNameEn.trim() ||
      !govNameAr.trim() ||
      price === "" ||
      !deliveryDays.trim()
    ) {
      return;
    }

    try {
      await dispatch(
        createShippingRateThunk({
          governmentEn: govNameEn.trim(),
          governmentAr: govNameAr.trim(),
          price: parseFloat(price),
          deliveryDays: deliveryDays.trim(),
        }),
      ).unwrap();
      resetAddForm();
    } catch (err) {
      setFormError(err || t("failedToSaveShippingRate"));
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editGovNameEn, setEditGovNameEn] = useState("");
  const [editGovNameAr, setEditGovNameAr] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDeliveryDays, setEditDeliveryDays] = useState("");

  const handleEdit = (rate) => {
    setEditingId(rate.id);
    setEditGovNameEn(rate.governmentEn || "");
    setEditGovNameAr(rate.governmentAr || "");
    setEditPrice(String(rate.price ?? ""));
    setEditDeliveryDays(rate.deliveryDays || "");
    setFormError("");
  };

  const handleSaveEdit = async () => {
    setFormError("");
    if (
      !editGovNameEn.trim() ||
      !editGovNameAr.trim() ||
      editPrice === "" ||
      !editDeliveryDays.trim()
    ) {
      return;
    }

    try {
      await dispatch(
        updateShippingRateThunk({
          id: editingId,
          governmentEn: editGovNameEn.trim(),
          governmentAr: editGovNameAr.trim(),
          price: parseFloat(editPrice),
          deliveryDays: editDeliveryDays.trim(),
        }),
      ).unwrap();
      setEditingId(null);
    } catch (err) {
      setFormError(err || t("failedToUpdateShippingRate"));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormError("");
  };

  const handleDelete = async (id) => {
    setFormError("");
    try {
      await dispatch(deleteShippingRateThunk(id)).unwrap();
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setFormError(err || t("failedToDeleteShippingRate"));
    }
  };

  return {
    shippingRates,
    freeShipping,
    isLoading,
    formError,
    fsThreshold,
    setFsThreshold,
    isSaved,
    handleToggleFreeShipping,
    handleSaveFsThreshold,
    govNameEn,
    setGovNameEn,
    govNameAr,
    setGovNameAr,
    price,
    setPrice,
    deliveryDays,
    setDeliveryDays,
    handleAdd,
    editingId,
    editGovNameEn,
    setEditGovNameEn,
    editGovNameAr,
    setEditGovNameAr,
    editPrice,
    setEditPrice,
    editDeliveryDays,
    setEditDeliveryDays,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  };
};
