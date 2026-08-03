import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSiteSettings,
  updateSiteSettings,
} from "../../../store/dataSlice";

export const useSettingsLogic = () => {
  const dispatch = useDispatch();
  const currentSettings = useSelector(selectSiteSettings);

  const [settings, setSettings] = useState(currentSettings);
  const [saveMessage, setSaveMessage] = useState("");
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSettings((prev) => ({ ...prev, logoUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = () => {
    if (imageInputUrl.trim()) {
      setSettings((prev) => ({ ...prev, logoUrl: imageInputUrl.trim() }));
      setImageInputUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSiteSettings(settings));

    setSaveMessage("Settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return {
    settings,
    setSettings,
    saveMessage,
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
