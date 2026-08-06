import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectOffers,
  addOffer,
  updateOffer,
  removeOffer,
} from "../../../store/dataSlice";

export const useOffersLogic = () => {
  const dispatch = useDispatch();
  const offers = useSelector(selectOffers);
  const [editingId, setEditingId] = useState(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("%");
  const [code, setCode] = useState("");
  const [expDate, setExpDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
      expDate,
    };

    if (editingId) {
      dispatch(updateOffer({ id: editingId, ...offerData }));
    } else {
      dispatch(addOffer({ id: crypto.randomUUID(), ...offerData }));
    }

    resetForm();
  };

  const handleEdit = (offer) => {
    setEditingId(offer.id);
    setTitleEn(offer.titleEn || offer.title || "");
    setTitleAr(offer.titleAr || offer.title || "");
    setDiscountValue(
      offer.discountValue || parseInt(offer.discountEn || offer.discount) || "",
    );
    setDiscountType(
      offer.discountType || (offer.discount?.includes("EGP") ? "EGP" : "%"),
    );
    setCode(offer.code || "");
    setExpDate(offer.expDate || "");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitleEn("");
    setTitleAr("");
    setDiscountValue("");
    setDiscountType("%");
    setCode("");
    setExpDate("");
  };

  const handleDelete = (id) => {
    dispatch(removeOffer(id));
  };

  return {
    offers,
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
    expDate,
    setExpDate,
    handleSubmit,
    handleEdit,
    resetForm,
    handleDelete,
  };
};
