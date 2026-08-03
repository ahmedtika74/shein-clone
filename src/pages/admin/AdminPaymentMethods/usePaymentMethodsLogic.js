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

  const [newMethodName, setNewMethodName] = useState("");
  const [newMethodDetails, setNewMethodDetails] = useState("");
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
    if (newMethodName.trim()) {
      dispatch(
        addPaymentMethod({
          id: crypto.randomUUID(),
          name: newMethodName.trim(),
          details: newMethodDetails.trim(),
          img: newMethodImg,
        }),
      );
      setNewMethodName("");
      setNewMethodDetails("");
      setNewMethodImg("");
      setImageInputUrl("");
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editImageInputUrl, setEditImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");
  const [editInputMode, setEditInputMode] = useState("upload");

  const handleEdit = (method) => {
    setEditingId(method.id);
    setEditName(method.name);
    setEditDetails(method.details || "");
    setEditImg(method.img || "");
    setEditImageInputUrl("");
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      dispatch(
        updatePaymentMethod({
          id: editingId,
          name: editName.trim(),
          details: editDetails.trim(),
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
    newMethodName,
    setNewMethodName,
    newMethodDetails,
    setNewMethodDetails,
    newMethodImg,
    setNewMethodImg,
    imageInputUrl,
    setImageInputUrl,
    handleFileUpload,
    handleAddUrl,
    handleAdd,
    editingId,
    editName,
    setEditName,
    editDetails,
    setEditDetails,
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
