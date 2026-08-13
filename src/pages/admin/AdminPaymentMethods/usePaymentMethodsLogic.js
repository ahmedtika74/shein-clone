import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectPaymentMethods,
  createPaymentMethodThunk,
  deletePaymentMethodThunk,
  updatePaymentMethodThunk,
} from "../../../store/dataSlice";
import {
  uploadMedia,
  MediaUsageCategory,
} from "../../../services/mediaUpload";

export const usePaymentMethodsLogic = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const paymentMethods = useSelector(selectPaymentMethods);
  const status = useSelector((state) => state.data.status);
  const isLoading = status === "loading";

  const [newMethodNameEn, setNewMethodNameEn] = useState("");
  const [newMethodNameAr, setNewMethodNameAr] = useState("");
  const [newMethodDetailsEn, setNewMethodDetailsEn] = useState("");
  const [newMethodDetailsAr, setNewMethodDetailsAr] = useState("");
  const [newMethodImg, setNewMethodImg] = useState("");
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("url");
  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e, setImgCallback) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setFormError("");
    try {
      const url = await uploadMedia(file, MediaUsageCategory.PaymentMethod);
      if (!url) throw new Error(t("uploadFailed"));
      setImgCallback(url);
    } catch (err) {
      setFormError(err?.message || t("uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = (url, setImgCallback, setUrlCallback) => {
    if (url.trim()) {
      setImgCallback(url.trim());
      setUrlCallback("");
      setFormError("");
    }
  };

  const resetAddForm = () => {
    setNewMethodNameEn("");
    setNewMethodNameAr("");
    setNewMethodDetailsEn("");
    setNewMethodDetailsAr("");
    setNewMethodImg("");
    setImageInputUrl("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!newMethodNameEn.trim() || !newMethodNameAr.trim()) return;

    try {
      await dispatch(
        createPaymentMethodThunk({
          nameEn: newMethodNameEn.trim(),
          nameAr: newMethodNameAr.trim(),
          detailsEn: newMethodDetailsEn.trim(),
          detailsAr: newMethodDetailsAr.trim(),
          imageUrl: newMethodImg || "",
        }),
      ).unwrap();
      resetAddForm();
    } catch (err) {
      setFormError(err || t("failedToSavePaymentMethod"));
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameAr, setEditNameAr] = useState("");
  const [editDetailsEn, setEditDetailsEn] = useState("");
  const [editDetailsAr, setEditDetailsAr] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editImageInputUrl, setEditImageInputUrl] = useState("");
  const [editInputMode, setEditInputMode] = useState("url");

  const handleEdit = (method) => {
    setEditingId(method.id);
    setEditNameEn(method.nameEn || "");
    setEditNameAr(method.nameAr || "");
    setEditDetailsEn(method.detailsEn || "");
    setEditDetailsAr(method.detailsAr || "");
    setEditImg(method.imageUrl || "");
    setEditImageInputUrl("");
    setFormError("");
  };

  const handleSaveEdit = async () => {
    setFormError("");
    if (!editNameEn.trim() || !editNameAr.trim()) return;

    try {
      await dispatch(
        updatePaymentMethodThunk({
          id: editingId,
          nameEn: editNameEn.trim(),
          nameAr: editNameAr.trim(),
          detailsEn: editDetailsEn.trim(),
          detailsAr: editDetailsAr.trim(),
          imageUrl: editImg || "",
        }),
      ).unwrap();
      setEditingId(null);
    } catch (err) {
      setFormError(err || t("failedToUpdatePaymentMethod"));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormError("");
  };

  const handleDelete = async (id) => {
    setFormError("");
    try {
      await dispatch(deletePaymentMethodThunk(id)).unwrap();
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setFormError(err || t("failedToDeletePaymentMethod"));
    }
  };

  return {
    paymentMethods,
    isLoading,
    isUploading,
    formError,
    newMethodNameEn,
    setNewMethodNameEn,
    newMethodNameAr,
    setNewMethodNameAr,
    newMethodDetailsEn,
    setNewMethodDetailsEn,
    newMethodDetailsAr,
    setNewMethodDetailsAr,
    newMethodImg,
    setNewMethodImg,
    imageInputUrl,
    setImageInputUrl,
    handleFileUpload,
    handleAddUrl,
    handleAdd,
    editingId,
    editNameEn,
    setEditNameEn,
    editNameAr,
    setEditNameAr,
    editDetailsEn,
    setEditDetailsEn,
    editDetailsAr,
    setEditDetailsAr,
    editImg,
    setEditImg,
    editImageInputUrl,
    setEditImageInputUrl,
    inputMode,
    setInputMode,
    editInputMode,
    setEditInputMode,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  };
};
