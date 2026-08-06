import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";

export const ImageUploader = ({
  inputMode,
  setInputMode,
  handleFileUpload,
  imageInputUrl,
  setImageInputUrl,
  handleAddUrl,
  imagesBase64,
  setImagesBase64,
  mainIndex,
}) => {
  const { t } = useTranslation(["admin"]);
  return (
    <div className={cn("border-t pt-4")}>
      <label className={cn("font-bold text-sm text-gray-800 block mb-2")}>
        {t("productImages")}
      </label>
      <div className={cn("flex flex-col gap-3 mb-4")}>
        <div className={cn("flex bg-gray-100 p-1 rounded-lg w-fit")}>
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
              inputMode === "upload"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t("uploadFile")}
          </button>
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
              inputMode === "url"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t("imageModeUrl")}
          </button>
        </div>

        {inputMode === "upload" ? (
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className={cn("hidden")}
              id="product-images-upload"
            />
            <label
              htmlFor="product-images-upload"
              className={cn(
                "inline-block bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap",
              )}
            >
              <i className={cn("fa-solid fa-upload me-2")}></i>
              {t("chooseFiles")}
            </label>
          </div>
        ) : (
          <div className={cn("flex w-full gap-2")}>
            <input
              type="text"
              placeholder={t("pasteImageUrl")}
              value={imageInputUrl}
              onChange={(e) => setImageInputUrl(e.target.value)}
              className={cn(
                "flex-1 min-w-0 h-9.5 px-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#e60023]",
              )}
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className={cn(
                "h-9.5 px-4 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap",
              )}
            >
              {t("addUrl")}
            </button>
          </div>
        )}
      </div>

      {/* PREVIEW CONTAINER */}
      {imagesBase64.length > 0 && (
        <div
          className={cn(
            "flex gap-3 flex-wrap bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300",
          )}
        >
          {imagesBase64.map((img, idx) => (
            <div key={img || `prodimg-${idx}`} className={cn("relative group")}>
              <img
                src={img}
                alt={`Preview ${idx}`}
                className={cn(
                  `w-17.5 h-17.5 object-cover rounded-lg border-2 ${
                    Number(mainIndex) === idx
                      ? "border-[#e60023]"
                      : "border-gray-200"
                  }`,
                )}
              />
              <button
                type="button"
                onClick={() =>
                  setImagesBase64((prev) => prev.filter((_, i) => i !== idx))
                }
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
