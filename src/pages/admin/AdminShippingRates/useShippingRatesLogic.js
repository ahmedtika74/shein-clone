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

  const [govName, setGovName] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (govName.trim() && price !== "" && deliveryDays.trim()) {
      dispatch(
        addShippingRate({
          id: crypto.randomUUID(),
          government: govName.trim(),
          price: parseFloat(price),
          deliveryDays: deliveryDays.trim(),
        }),
      );
      setGovName("");
      setPrice("");
      setDeliveryDays("");
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editGovName, setEditGovName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDeliveryDays, setEditDeliveryDays] = useState("");

  const handleEdit = (rate) => {
    setEditingId(rate.id);
    setEditGovName(rate.government);
    setEditPrice(rate.price.toString());
    setEditDeliveryDays(rate.deliveryDays || "");
  };

  const handleSaveEdit = () => {
    if (editGovName.trim() && editPrice !== "" && editDeliveryDays.trim()) {
      dispatch(
        updateShippingRate({
          id: editingId,
          government: editGovName.trim(),
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
    govName,
    setGovName,
    price,
    setPrice,
    deliveryDays,
    setDeliveryDays,
    handleAdd,
    editingId,
    editGovName,
    setEditGovName,
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
