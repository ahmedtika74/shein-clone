import { cn } from "../../../utils/cn";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, Button, Input } from "../../../components/ui";
import { updateSideCardThunk } from "../../../store/dataSlice";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "../../../utils/localization";
import { getImageUrl } from "../../../utils/getImageUrl";
import { uploadMedia, MediaUsageCategory } from "../../../services/mediaUpload";

const SideCardEditor = ({ card, index, side }) => {
  const { t, i18n } = useTranslation("admin");
  const dispatch = useDispatch();
  const [titleEn, setTitleEn] = useState(card.titleEn || "");
  const [titleAr, setTitleAr] = useState(card.titleAr || "");
  const [actionTextEn, setActionTextEn] = useState(card.actionTextEn || "");
  const [actionTextAr, setActionTextAr] = useState(card.actionTextAr || "");
  const [imageUrl, setImageUrl] = useState(card.imageUrl || "");
  const [link, setLink] = useState(card.link || "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [inputMode, setInputMode] = useState("upload");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setError("");
    try {
      const url = await uploadMedia(file, MediaUsageCategory.Hero);
      if (!url) throw new Error(t("uploadFailed"));
      setImageUrl(url);
    } catch (err) {
      setError(err?.message || t("uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setIsSaving(true);
    // API slots are 1-based; fall back to list index + 1 when slot is missing.
    const slot = Number(card.slot) > 0 ? Number(card.slot) : index + 1;
    try {
      await dispatch(
        updateSideCardThunk({
          position: side,
          slot,
          card: {
            titleEn,
            titleAr,
            actionTextEn,
            actionTextAr,
            imageUrl,
            link,
          },
        }),
      ).unwrap();
      setIsEditing(false);
    } catch (err) {
      setError(err || t("failedToSaveCard"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <Card className={cn("p-0 overflow-hidden shadow-xs")}>
        <CardContent className={cn("p-4")}>
          <img
            src={getImageUrl(card.imageUrl)}
            alt={getLocalizedString(card, "title", i18n.language)}
            className={cn("w-full h-32 object-cover rounded-lg mb-3")}
          />
          <h4 className={cn("font-bold text-sm text-gray-900")}>
            {getLocalizedString(card, "title", i18n.language)}
          </h4>
          <p className={cn("text-xs text-gray-500 mb-1")}>
            {getLocalizedString(card, "actionText", i18n.language)}
          </p>
          <p className={cn("text-xs text-blue-500 truncate mb-3")}>
            {card.link || t("noLink")}
          </p>
          <Button
            variant="outline"
            className={cn("w-full h-9 text-xs")}
            onClick={() => {
              setTitleEn(card.titleEn || "");
              setTitleAr(card.titleAr || "");
              setActionTextEn(card.actionTextEn || "");
              setActionTextAr(card.actionTextAr || "");
              setImageUrl(card.imageUrl || "");
              setLink(card.link || "");
              setError("");
              setIsEditing(true);
            }}
          >
            {t("editCard")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gray-50 shadow-xs p-0")}>
      <CardContent className={cn("p-4 space-y-3")}>
        <Input
          label={`${t("title")} (English)`}
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder={`${t("title")} (EN)`}
        />
        <Input
          label={`${t("title")} (Arabic)`}
          value={titleAr}
          onChange={(e) => setTitleAr(e.target.value)}
          placeholder={`${t("title")} (AR)`}
        />
        <Input
          label={`${t("actionText")} (English)`}
          value={actionTextEn}
          onChange={(e) => setActionTextEn(e.target.value)}
          placeholder={`${t("actionText")} (EN)`}
        />
        <Input
          label={`${t("actionText")} (Arabic)`}
          value={actionTextAr}
          onChange={(e) => setActionTextAr(e.target.value)}
          placeholder={`${t("actionText")} (AR)`}
        />
        <div>
          <label
            className={cn(
              "block text-[10px] font-bold text-gray-500 uppercase mb-1",
            )}
          >
            {t("imageSource")}
          </label>
          <div className={cn("flex bg-gray-200 p-1 rounded-lg w-fit mb-2")}>
            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                inputMode === "upload"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {t("upload")}
            </button>
            <button
              type="button"
              onClick={() => setInputMode("url")}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                inputMode === "url"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {t("url")}
            </button>
          </div>
          {inputMode === "upload" ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={cn("hidden")}
                id={`card-img-upload-${side}-${index}`}
              />
              <label
                htmlFor={`card-img-upload-${side}-${index}`}
                className={cn(
                  "inline-flex items-center justify-center bg-black text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-9",
                  isUploading && "opacity-60 pointer-events-none",
                )}
              >
                <i className={cn("fa-solid fa-upload me-2")}></i>{" "}
                {isUploading
                  ? t("uploading", { defaultValue: "Uploading..." })
                  : t("chooseFile")}
              </label>
            </div>
          ) : (
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/products/CasualJeans.jpg"
            />
          )}
          {imageUrl && (
            <img
              src={getImageUrl(imageUrl)}
              alt={t("preview")}
              className={cn(
                "w-full h-20 object-cover rounded-lg mt-2 border border-gray-200",
              )}
            />
          )}
        </div>
        <Input
          label={t("redirectLink")}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="/products?category=..."
        />
        {error && (
          <p className={cn("text-xs text-red-600 font-medium")}>{error}</p>
        )}
        <div className={cn("flex gap-2 mt-4 pt-2 border-t border-gray-200")}>
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className={cn("flex-1 h-9 text-xs")}
          >
            {isSaving ? t("saving") : t("save")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsEditing(false)}
            className={cn("flex-1 h-9 text-xs")}
          >
            {t("cancel")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SideCardGrid = ({ cards, side }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6")}>
      {cards.map((card, idx) => (
        <SideCardEditor
          key={card.id || `${side}-${idx}`}
          card={card}
          index={idx}
          side={side}
        />
      ))}
    </div>
  );
};
