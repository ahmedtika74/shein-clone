import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectHeroSlides,
  selectLeftSideCards,
  selectRightSideCards,
  createHeroBannerThunk,
  updateHeroBannerThunk,
  deleteHeroBannerThunk,
} from "../../../store/dataSlice";
import { uploadMedia, MediaUsageCategory } from "../../../services/mediaUpload";

export const useHeroLogic = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const heroSlides = useSelector(selectHeroSlides);
  const leftSideCards = useSelector(selectLeftSideCards);
  const rightSideCards = useSelector(selectRightSideCards);
  const status = useSelector((state) => state.data.status);
  const isLoading = status === "loading";

  const [editId, setEditId] = useState(null);
  const [newSlideUrl, setNewSlideUrl] = useState("");
  const [newSlideLink, setNewSlideLink] = useState("");
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");
  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setFormError("");
    try {
      const url = await uploadMedia(file, MediaUsageCategory.Hero);
      if (!url) throw new Error(t("uploadFailed"));
      setNewSlideUrl(url);
    } catch (err) {
      setFormError(err?.message || t("uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (imageInputUrl.trim()) {
      setNewSlideUrl(imageInputUrl.trim());
      setImageInputUrl("");
      setFormError("");
    }
  };

  const resetSlideForm = () => {
    setEditId(null);
    setNewSlideUrl("");
    setImageInputUrl("");
    setNewSlideLink("");
    setFormError("");
  };

  const handleEditSlide = (slide) => {
    setEditId(slide.id);
    setNewSlideUrl(slide.imageUrl || slide.img || "");
    setNewSlideLink(slide.link || "");
    setImageInputUrl("");
    setFormError("");
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!newSlideUrl.trim()) return;

    const payload = {
      imageUrl: newSlideUrl.trim(),
      link: newSlideLink.trim(),
    };

    try {
      if (editId) {
        await dispatch(
          updateHeroBannerThunk({ id: editId, ...payload }),
        ).unwrap();
      } else {
        await dispatch(createHeroBannerThunk(payload)).unwrap();
      }
      resetSlideForm();
    } catch (err) {
      setFormError(err || t("failedToSaveBanner"));
    }
  };

  const handleDeleteSlide = async (id) => {
    setFormError("");
    try {
      await dispatch(deleteHeroBannerThunk(id)).unwrap();
      if (editId === id) resetSlideForm();
    } catch (err) {
      setFormError(err || t("failedToDeleteBanner"));
    }
  };

  return {
    heroSlides,
    leftSideCards,
    rightSideCards,
    isLoading,
    isUploading,
    editId,
    newSlideUrl,
    setNewSlideUrl,
    newSlideLink,
    setNewSlideLink,
    imageInputUrl,
    setImageInputUrl,
    inputMode,
    setInputMode,
    formError,
    handleFileUpload,
    handleAddUrl,
    handleAddSlide,
    handleEditSlide,
    handleDeleteSlide,
    resetSlideForm,
  };
};
