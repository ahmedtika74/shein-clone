import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { ImageUrlField } from "../../../components/admin/ImageUrlField";
import { MediaUsageCategory } from "../../../services/mediaUpload";

const fieldClasses =
  "h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm";

export const ColorPicker = ({ colors, onAdd, onRemove, onChange }) => {
  const { t } = useTranslation("admin");

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
          onClick={onAdd}
          className={cn(
            "text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer",
          )}
        >
          {t("addColor")}
        </button>
      </div>

      {colors.map((color, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-5 gap-3 items-center",
            )}
          >
            <input
              type="text"
              placeholder={`${t("colorName")} (EN)`}
              value={color.nameEn}
              onChange={(event) =>
                onChange(index, "nameEn", event.target.value)
              }
              className={cn(fieldClasses)}
            />
            <input
              type="text"
              placeholder={`${t("colorName")} (AR)`}
              value={color.nameAr}
              onChange={(event) =>
                onChange(index, "nameAr", event.target.value)
              }
              className={cn(fieldClasses)}
            />
            <div
              className={cn(
                "flex items-center gap-2 border border-gray-300 rounded h-10 px-2",
              )}
            >
              <input
                type="color"
                aria-label={t("hex")}
                value={color.hex || "#000000"}
                onChange={(event) => onChange(index, "hex", event.target.value)}
                className={cn(
                  "w-6 h-6 border-none p-0 cursor-pointer bg-transparent",
                )}
              />
              <input
                type="text"
                placeholder={t("hex")}
                value={color.hex}
                onChange={(event) => onChange(index, "hex", event.target.value)}
                className={cn("w-full border-none outline-none text-sm")}
              />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder={t("specificPrice")}
              value={color.price}
              onChange={(event) =>
                onChange(index, "price", event.target.value)
              }
              className={cn(fieldClasses)}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className={cn(
                "text-red-500 hover:text-red-700 font-bold text-sm md:ms-auto cursor-pointer text-start md:text-end",
              )}
            >
              {t("remove")}
            </button>
          </div>

          <ImageUrlField
            label={t("imageUrl")}
            value={color.imageUrl || ""}
            onChange={(url) => onChange(index, "imageUrl", url)}
            usageCategory={MediaUsageCategory.Product}
            compact
          />
        </div>
      ))}

      {colors.length === 0 && (
        <p className={cn("text-sm text-gray-500")}>{t("noColorsAdded")}</p>
      )}
    </div>
  );
};
