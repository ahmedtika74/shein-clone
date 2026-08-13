import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectCategories,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "../../../store/dataSlice";

export const useCategoriesLogic = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector((state) => state.data.status);
  const isLoading = status === "loading";

  const [editId, setEditId] = useState(null);
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [catImg, setCatImg] = useState("");
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setEditId(null);
    setCatNameEn("");
    setCatNameAr("");
    setCatImg("");
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!catNameEn || !catNameAr) return;

    const payload = {
      nameEn: catNameEn,
      nameAr: catNameAr,
      imageUrl: catImg || "",
    };

    try {
      if (editId) {
        await dispatch(
          updateCategoryThunk({ id: editId, ...payload }),
        ).unwrap();
      } else {
        await dispatch(createCategoryThunk(payload)).unwrap();
      }
      resetForm();
    } catch (err) {
      setFormError(err || t("failedToSaveCategory"));
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setCatNameEn(cat.nameEn || "");
    setCatNameAr(cat.nameAr || "");
    setCatImg(cat.imageUrl || "");
    setFormError("");
  };

  const handleDelete = async (id) => {
    setFormError("");
    try {
      await dispatch(deleteCategoryThunk(id)).unwrap();
      if (editId === id) resetForm();
    } catch (err) {
      setFormError(err || t("failedToDeleteCategory"));
    }
  };

  return {
    categories,
    isLoading,
    editId,
    catNameEn,
    setCatNameEn,
    catNameAr,
    setCatNameAr,
    catImg,
    setCatImg,
    formError,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};
