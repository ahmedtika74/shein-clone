import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectOffers,
  createOfferThunk,
  updateOfferThunk,
  deleteOfferThunk,
} from "../../../store/dataSlice";

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
};

export const useOffersLogic = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const offers = useSelector(selectOffers);
  const status = useSelector((state) => state.data.status);
  const isLoading = status === "loading";

  const [editingId, setEditingId] = useState(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("%");
  const [code, setCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setTitleEn("");
    setTitleAr("");
    setDiscountValue("");
    setDiscountType("%");
    setCode("");
    setExpiryDate("");
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!titleEn || !titleAr || !discountValue) return;

    const discountEn = `${discountValue}${discountType === "%" ? "% OFF" : " EGP OFF"}`;
    const discountAr = `${discountValue}${discountType === "%" ? "% خصم" : " جنيه خصم"}`;

    const offerData = {
      titleEn,
      titleAr,
      discountEn,
      discountAr,
      discountValue: Number(discountValue),
      discountType,
      code,
      expiryDate,
    };

    try {
      if (editingId) {
        await dispatch(
          updateOfferThunk({ id: editingId, ...offerData, isActive: true }),
        ).unwrap();
      } else {
        // OfferCreateDto has no isActive (additionalProperties: false).
        await dispatch(createOfferThunk(offerData)).unwrap();
      }
      resetForm();
    } catch (err) {
      setFormError(err || t("failedToSaveOffer"));
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer.id);
    setTitleEn(offer.titleEn || "");
    setTitleAr(offer.titleAr || "");
    setDiscountValue(
      offer.discountValue || parseInt(offer.discountEn, 10) || "",
    );
    setDiscountType(
      offer.discountType ||
        (String(offer.discountEn || "").includes("EGP") ? "EGP" : "%"),
    );
    setCode(offer.code || "");
    setExpiryDate(toDateInputValue(offer.expiryDate));
    setFormError("");
  };

  const handleDelete = async (id) => {
    setFormError("");
    try {
      await dispatch(deleteOfferThunk(id)).unwrap();
      if (editingId === id) resetForm();
    } catch (err) {
      setFormError(err || t("failedToDeleteOffer"));
    }
  };

  return {
    offers,
    isLoading,
    editingId,
    titleEn,
    setTitleEn,
    titleAr,
    setTitleAr,
    discountValue,
    setDiscountValue,
    discountType,
    setDiscountType,
    code,
    setCode,
    expiryDate,
    setExpiryDate,
    formError,
    handleSubmit,
    handleEdit,
    resetForm,
    handleDelete,
  };
};
