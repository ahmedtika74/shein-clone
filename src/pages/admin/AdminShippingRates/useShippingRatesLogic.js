import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectShippingRates,
  addShippingRate,
  removeShippingRate,
  updateShippingRate,
  selectFreeShipping,
  updateFreeShipping,
} from "../../../store/dataSlice";

export const useShippingRatesLogic = () => {
  const dispatch = useDispatch();
  const shippingRates = useSelector(selectShippingRates);
  const freeShipping = useSelector(selectFreeShipping) || {
    enabled: false,
    threshold: 1000,
  };

  const [fsThreshold, setFsThreshold] = useState(freeShipping.threshold);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleFreeShipping = () => {
    dispatch(updateFreeShipping({ enabled: !freeShipping.enabled }));
  };

  const handleSaveFsThreshold = () => {
    const val = parseFloat(fsThreshold);
    if (!isNaN(val) && val >= 0) {
      dispatch(updateFreeShipping({ threshold: val }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const [govNameEn, setGovNameEn] = useState("");
  const [govNameAr, setGovNameAr] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (
      govNameEn.trim() &&
      govNameAr.trim() &&
      price !== "" &&
      deliveryDays.trim()
    ) {
      dispatch(
        addShippingRate({
          id: crypto.randomUUID(),
          governmentEn: govNameEn.trim(),
          governmentAr: govNameAr.trim(),
          price: parseFloat(price),
          deliveryDays: deliveryDays.trim(),
        }),
      );
      setGovNameEn("");
      setGovNameAr("");
      setPrice("");
      setDeliveryDays("");
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editGovNameEn, setEditGovNameEn] = useState("");
  const [editGovNameAr, setEditGovNameAr] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDeliveryDays, setEditDeliveryDays] = useState("");

  const handleEdit = (rate) => {
    setEditingId(rate.id);
    setEditGovNameEn(rate.governmentEn || rate.government || "");
    setEditGovNameAr(rate.governmentAr || rate.government || "");
    setEditPrice(rate.price.toString());
    setEditDeliveryDays(rate.deliveryDays || "");
  };

  const handleSaveEdit = () => {
    if (
      editGovNameEn.trim() &&
      editGovNameAr.trim() &&
      editPrice !== "" &&
      editDeliveryDays.trim()
    ) {
      dispatch(
        updateShippingRate({
          id: editingId,
          governmentEn: editGovNameEn.trim(),
          governmentAr: editGovNameAr.trim(),
          price: parseFloat(editPrice),
          deliveryDays: editDeliveryDays.trim(),
        }),
      );
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    dispatch(removeShippingRate(id));
  };

  return {
    shippingRates,
    freeShipping,
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
