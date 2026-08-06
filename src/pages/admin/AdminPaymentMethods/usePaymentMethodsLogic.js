import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod,
} from "../../../store/dataSlice";

export const usePaymentMethodsLogic = () => {
  const dispatch = useDispatch();
  const paymentMethods = useSelector(selectPaymentMethods);

  const [newMethodNameEn, setNewMethodNameEn] = useState("");
  const [newMethodNameAr, setNewMethodNameAr] = useState("");
  const [newMethodDetailsEn, setNewMethodDetailsEn] = useState("");
  const [newMethodDetailsAr, setNewMethodDetailsAr] = useState("");
  const [newMethodImg, setNewMethodImg] = useState("");
  const [imageInputUrl, setImageInputUrl] = useState("");

  const handleFileUpload = (e, setImgCallback) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgCallback(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = (url, setImgCallback, setUrlCallback) => {
    if (url.trim()) {
      setImgCallback(url.trim());
      setUrlCallback("");
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (newMethodNameEn.trim() && newMethodNameAr.trim()) {
      dispatch(
        addPaymentMethod({
          id: crypto.randomUUID(),
          nameEn: newMethodNameEn.trim(),
          nameAr: newMethodNameAr.trim(),
          detailsEn: newMethodDetailsEn.trim(),
          detailsAr: newMethodDetailsAr.trim(),
          img: newMethodImg,
        }),
      );
      setNewMethodNameEn("");
      setNewMethodNameAr("");
      setNewMethodDetailsEn("");
      setNewMethodDetailsAr("");
      setNewMethodImg("");
      setImageInputUrl("");
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameAr, setEditNameAr] = useState("");
  const [editDetailsEn, setEditDetailsEn] = useState("");
  const [editDetailsAr, setEditDetailsAr] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editImageInputUrl, setEditImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");
  const [editInputMode, setEditInputMode] = useState("upload");

  const handleEdit = (method) => {
    setEditingId(method.id);
    setEditNameEn(method.nameEn || method.name || "");
    setEditNameAr(method.nameAr || method.name || "");
    setEditDetailsEn(method.detailsEn || method.details || "");
    setEditDetailsAr(method.detailsAr || method.details || "");
    setEditImg(method.img || "");
    setEditImageInputUrl("");
  };

  const handleSaveEdit = () => {
    if (editNameEn.trim() && editNameAr.trim()) {
      dispatch(
        updatePaymentMethod({
          id: editingId,
          nameEn: editNameEn.trim(),
          nameAr: editNameAr.trim(),
          detailsEn: editDetailsEn.trim(),
          detailsAr: editDetailsAr.trim(),
          img: editImg,
        }),
      );
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    dispatch(removePaymentMethod(id));
  };

  return {
    paymentMethods,
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
