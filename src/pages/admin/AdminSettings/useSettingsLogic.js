import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectSiteSettings,
  updateSiteSettingsThunk,
} from "../../../store/dataSlice";
import { uploadMedia, MediaUsageCategory } from "../../../services/mediaUpload";

export const useSettingsLogic = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const currentSettings = useSelector(selectSiteSettings);

  const [settings, setSettings] = useState(currentSettings);
  const [saveMessage, setSaveMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || {}),
        [name]: value,
      },
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadError("");
    try {
      const url = await uploadMedia(file, MediaUsageCategory.Other);
      if (!url) throw new Error(t("uploadFailed"));
      setSettings((prev) => ({ ...prev, logoUrl: url }));
    } catch (err) {
      setUploadError(err?.message || t("uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (imageInputUrl.trim()) {
      setSettings((prev) => ({ ...prev, logoUrl: imageInputUrl.trim() }));
      setImageInputUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      siteName: settings.siteName,
      logoUrl: settings.type === "text" ? "" : settings.logoUrl,
      socialLinks: settings.socialLinks,
    };
    dispatch(updateSiteSettingsThunk(payload));

    setSaveMessage(t("settingsSaved"));
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return {
    settings,
    setSettings,
    saveMessage,
    uploadError,
    isUploading,
    imageInputUrl,
    setImageInputUrl,
    inputMode,
    setInputMode,
    handleChange,
    handleSocialChange,
    handleFileUpload,
    handleAddUrl,
    handleSubmit,
  };
};
