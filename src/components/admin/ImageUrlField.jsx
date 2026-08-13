import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { getImageUrl } from "../../utils/getImageUrl";
import { uploadMedia, MediaUsageCategory } from "../../services/mediaUpload";

const inputClasses =
  "flex-1 min-w-0 h-10 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#e60023]";

const ModeToggle = ({ mode, setMode }) => {
  const { t } = useTranslation("admin");
  return (
    <div className={cn("flex bg-gray-100 p-1 rounded-lg w-fit")}>
      <button
        type="button"
        onClick={() => setMode("upload")}
        className={cn(
          "px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
          mode === "upload"
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-gray-700",
        )}
      >
        {t("uploadFile")}
      </button>
      <button
        type="button"
        onClick={() => setMode("url")}
        className={cn(
          "px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
          mode === "url"
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-gray-700",
        )}
      >
        {t("imageLink")}
      </button>
    </div>
  );
};

/**
 * Single image field with Upload / URL modes (same pattern as categories).
 * Uploads go through POST /media/upload and store the returned public URL.
 */
export const ImageUrlField = ({
  label,
  value,
  onChange,
  usageCategory = MediaUsageCategory.Product,
  compact = false,
}) => {
  const { t } = useTranslation("admin");
  const inputId = useId();
  const [mode, setMode] = useState("upload");
  const [draftUrl, setDraftUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadMedia(file, usageCategory);
      if (!url) throw new Error(t("uploadFailed"));
      onChange(url);
    } catch (err) {
      setError(err?.message || t("uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    const url = draftUrl.trim();
    if (!url) return;
    onChange(url);
    setDraftUrl("");
    setError("");
  };

  return (
    <div className={cn("flex flex-col gap-2", compact && "min-w-0")}>
      {label && (
        <label className={cn("font-bold text-sm text-gray-800")}>{label}</label>
      )}

      {value ? (
        <div className={cn("relative w-20 h-20 group")}>
          <img
            src={getImageUrl(value)}
            alt={t("preview")}
            className={cn(
              "w-20 h-20 object-cover rounded-lg border border-gray-200",
            )}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={t("remove")}
            className={cn(
              "absolute -top-2 -end-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer",
            )}
          >
            <i className={cn("fa-solid fa-times")}></i>
          </button>
        </div>
      ) : null}

      <div className={cn("flex flex-col gap-2")}>
        <ModeToggle mode={mode} setMode={setMode} />

        {mode === "upload" ? (
          <div>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
              className={cn("hidden")}
            />
            <label
              htmlFor={inputId}
              className={cn(
                "inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-[42px]",
                uploading && "opacity-60 pointer-events-none",
              )}
            >
              <i className={cn("fa-solid fa-upload me-2")}></i>
              {uploading
                ? t("uploading", { defaultValue: "Uploading..." })
                : value
                  ? t("replaceImage")
                  : t("chooseFile")}
            </label>
          </div>
        ) : (
          <div className={cn("flex w-full gap-2 items-start")}>
            <input
              type="text"
              value={draftUrl}
              onChange={(event) => setDraftUrl(event.target.value)}
              placeholder="https://… or /products/example.jpg"
              className={cn(inputClasses)}
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className={cn(
                "h-10 px-4 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer",
              )}
            >
              {value ? t("replaceUrl") : t("addUrl")}
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className={cn("text-xs text-red-600 font-medium")}>{error}</p>
      )}
    </div>
  );
};

/** Ordered list of image URLs, with the main image highlighted. */
export const ImageUrlListField = ({
  label,
  values,
  onChange,
  mainIndex,
  usageCategory = MediaUsageCategory.Product,
}) => {
  const { t } = useTranslation("admin");
  const inputId = useId();
  const [mode, setMode] = useState("upload");
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const addUrl = (url) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
  };

  const handleAddUrl = () => {
    addUrl(draft);
    setDraft("");
    setError("");
  };

  const handleFile = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError("");
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadMedia(file, usageCategory);
        if (url) urls.push(url);
      }
      if (!urls.length) {
        throw new Error(t("uploadFailed"));
      }
      onChange([...values, ...urls]);
    } catch (err) {
      setError(err?.message || t("uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className={cn("border-t border-gray-200 pt-4")}>
      <label className={cn("font-bold text-sm text-gray-800 block mb-2")}>
        {label}
      </label>

      <div className={cn("flex flex-col gap-3")}>
        <ModeToggle mode={mode} setMode={setMode} />

        {mode === "upload" ? (
          <div>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFile}
              disabled={uploading}
              className={cn("hidden")}
            />
            <label
              htmlFor={inputId}
              className={cn(
                "inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-[42px]",
                uploading && "opacity-60 pointer-events-none",
              )}
            >
              <i className={cn("fa-solid fa-upload me-2")}></i>
              {uploading
                ? t("uploading", { defaultValue: "Uploading..." })
                : t("chooseFiles")}
            </label>
          </div>
        ) : (
          <div className={cn("flex w-full gap-2")}>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="/products/example.jpg"
              className={cn(inputClasses)}
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className={cn(
                "h-10 px-4 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer",
              )}
            >
              {t("addUrl")}
            </button>
          </div>
        )}

        {error && (
          <p className={cn("text-xs text-red-600 font-medium")}>{error}</p>
        )}
      </div>

      {values.length > 0 && (
        <div
          className={cn(
            "flex gap-3 flex-wrap bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mt-3",
          )}
        >
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className={cn("relative")}>
              <img
                src={getImageUrl(url)}
                alt={`${t("preview")} ${index + 1}`}
                className={cn(
                  "w-17.5 h-17.5 object-cover rounded-lg border-2",
                  Number(mainIndex) === index
                    ? "border-[#e60023]"
                    : "border-gray-200",
                )}
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={t("remove")}
                className={cn(
                  "absolute -top-2 -end-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center shadow cursor-pointer",
                )}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
