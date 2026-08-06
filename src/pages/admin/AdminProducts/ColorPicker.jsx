import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";

export const ColorPicker = ({
  selectedColors,
  handleAddColor,
  handleRemoveColor,
  handleColorChange,
}) => {
  const { t } = useTranslation(["admin"]);
  return (
    <div
      className={cn(
        "col-span-1 md:col-span-4 flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200",
      )}
    >
      <div className={cn("flex justify-between items-center")}>
        <label className={cn("font-bold text-sm text-gray-800")}>
          {t("productColors")}
        </label>
        <button
          type="button"
          onClick={handleAddColor}
          className={cn(
            "text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800",
          )}
        >
          {t("addColor")}
        </button>
      </div>
      {selectedColors.map((color, idx) => (
        <div
          key={idx}
          className={cn(
            "grid grid-cols-1 md:grid-cols-6 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm",
          )}
        >
          <input
            type="text"
            placeholder={`${t("colorName")} (EN)`}
            value={color.nameEn || ""}
            onChange={(e) => handleColorChange(idx, "nameEn", e.target.value)}
            className={cn(
              "h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm",
            )}
          />
          <input
            type="text"
            placeholder={`${t("colorName")} (AR)`}
            value={color.nameAr || ""}
            onChange={(e) => handleColorChange(idx, "nameAr", e.target.value)}
            className={cn(
              "h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm",
            )}
          />
          <div
            className={cn(
              "flex items-center gap-2 border border-gray-300 rounded h-10 px-2",
            )}
          >
            <input
              type="color"
              value={color.hex || "#000000"}
              onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
              className={cn(
                "w-6 h-6 border-none p-0 cursor-pointer bg-transparent",
              )}
            />
            <input
              type="text"
              placeholder={t("hex")}
              value={color.hex || ""}
              onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
              className={cn("w-full border-none outline-none text-sm")}
            />
          </div>
          <input
            type="text"
            placeholder={t("imageUrl")}
            value={color.image || ""}
            onChange={(e) => handleColorChange(idx, "image", e.target.value)}
            className={cn(
              "h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm md:col-span-1",
            )}
          />
          <input
            type="number"
            placeholder={t("specificPrice")}
            value={color.price || ""}
            onChange={(e) => handleColorChange(idx, "price", e.target.value)}
            className={cn(
              "h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm md:col-span-1",
            )}
          />
          <button
            type="button"
            onClick={() => handleRemoveColor(idx)}
            className={cn(
              "text-red-500 hover:text-red-700 font-bold text-sm ms-auto",
            )}
          >
            {t("remove")}
          </button>
        </div>
      ))}
      {selectedColors.length === 0 && (
        <p className={cn("text-sm text-gray-500")}>{t("noColorsAdded")}</p>
      )}
    </div>
  );
};
