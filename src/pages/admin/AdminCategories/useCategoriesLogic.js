import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCategories,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "../../../store/dataSlice";

export const useCategoriesLogic = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector((state) => state.data.status);
  const isLoading = status === "loading";

  const [editId, setEditId] = useState(null);
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [catImg, setCatImg] = useState("");
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCatImg(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = () => {
    if (imageInputUrl.trim()) {
      setCatImg(imageInputUrl.trim());
      setImageInputUrl("");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setCatNameEn("");
    setCatNameAr("");
    setCatImg("");
    setImageInputUrl("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!catNameEn || !catNameAr) return;

    if (editId) {
      dispatch(
        updateCategoryThunk({
          id: editId,
          nameEn: catNameEn,
          nameAr: catNameAr,
          img: catImg || "/images/dress.webp",
        }),
      );
    } else {
      dispatch(
        createCategoryThunk({
          nameEn: catNameEn,
          nameAr: catNameAr,
          img: catImg || "/images/dress.webp",
        }),
      );
    }

    resetForm();
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setCatNameEn(cat.nameEn || "");
    setCatNameAr(cat.nameAr || "");
    setCatImg(cat.img);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategoryThunk(id));
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
    imageInputUrl,
    setImageInputUrl,
    inputMode,
    setInputMode,
    handleFileUpload,
    handleAddUrl,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};
