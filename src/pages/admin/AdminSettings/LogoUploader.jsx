import { cn } from "../../../utils/cn";
import { Button, Input } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../../utils/getImageUrl";

export const LogoUploader = ({
  settings,
  setSettings,
  inputMode,
  setInputMode,
  handleFileUpload,
  imageInputUrl,
  setImageInputUrl,
  handleAddUrl,
  isUploading,
  uploadError,
}) => {
  const { t } = useTranslation("admin");
  if (settings.type === "text") {
    return (
      <div
        className={cn(
          "mt-4 p-4 border border-gray-100 rounded-lg bg-gray-50 inline-block",
        )}
      >
        <p className={cn("text-xs text-gray-500 mb-2")}>{t("previewLabel")}</p>
        <span
          className={cn(
            "text-2xl md:text-3xl font-black tracking-tighter uppercase",
          )}
        >
          {settings.siteName}
        </span>
      </div>
    );
  }

  return (
    <div>
      <label className={cn("block text-sm font-medium text-gray-700 mb-2")}>
        {t("logoImage")}
      </label>

      <div className={cn("flex flex-col gap-4")}>
        {settings.logoUrl && (
          <div className={cn("relative w-fit group")}>
            <div
              className={cn(
                "p-4 border border-gray-100 rounded-lg bg-gray-50 inline-block",
              )}
            >
              <img
                src={getImageUrl(settings.logoUrl)}
                alt={t("logoPreview")}
                className={cn("h-12 object-contain")}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150x50?text=Invalid+Image";
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, logoUrl: "" }))}
              className={cn(
                "absolute -top-2 -end-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs shadow-md cursor-pointer",
              )}
            >
              <i className={cn("fa-solid fa-times")}></i>
            </button>
          </div>
        )}

        {!settings.logoUrl && (
          <div className={cn("flex flex-col gap-3")}>
            <div className={cn("flex bg-gray-100 p-1 rounded-lg w-fit")}>
              <button
                type="button"
                onClick={() => setInputMode("upload")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                  inputMode === "upload"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {t("uploadFile", { defaultValue: "Upload File" })}
              </button>
              <button
                type="button"
                onClick={() => setInputMode("url")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                  inputMode === "url"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {t("imageModeUrl", { defaultValue: "Image URL" })}
              </button>
            </div>

            {inputMode === "upload" ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className={cn("hidden")}
                  id="logo-image-upload"
                />
                <label
                  htmlFor="logo-image-upload"
                  className={cn(
                    "inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-[42px]",
                    isUploading && "opacity-60 pointer-events-none",
                  )}
                >
                  <i className={cn("fa-solid fa-upload me-2")}></i>
                  {isUploading
                    ? t("uploading", { defaultValue: "Uploading..." })
                    : t("chooseFile", { defaultValue: "Choose File..." })}
                </label>
              </div>
            ) : (
              <div className={cn("flex w-full gap-2 items-start")}>
                <Input
                  value={imageInputUrl}
                  onChange={(e) => setImageInputUrl(e.target.value)}
                  placeholder={t("imageUrlPlaceholder", {
                    defaultValue: "Image URL...",
                  })}
                  className={cn("flex-1 min-w-0")}
                />
                <Button
                  type="button"
                  onClick={handleAddUrl}
                  className={cn("h-[46px]")}
                >
                  {t("addUrl", { defaultValue: "Add URL" })}
                </Button>
              </div>
            )}
          </div>
        )}
        {uploadError && (
          <p className={cn("text-xs text-red-600 font-medium")}>{uploadError}</p>
        )}
      </div>
    </div>
  );
};
