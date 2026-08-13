import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";

const fieldClasses =
  "flex-1 min-w-[150px] h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm";

export const SizePicker = ({ sizes, onAdd, onRemove, onChange }) => {
  const { t } = useTranslation("admin");

  return (
    <div
      className={cn(
        "col-span-1 md:col-span-4 flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200",
      )}
    >
      <div className={cn("flex justify-between items-center")}>
        <label className={cn("font-bold text-sm text-gray-800")}>
          {t("productSizes")}
        </label>
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            "text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer",
          )}
        >
          {t("addSize")}
        </button>
      </div>

      {sizes.map((size, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-wrap md:flex-nowrap gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm",
          )}
        >
          <input
            type="text"
            placeholder={t("sizeName")}
            value={size.name}
            onChange={(event) => onChange(index, "name", event.target.value)}
            className={cn(fieldClasses)}
          />
          <input
            type="number"
            step="0.01"
            placeholder={t("priceAdj")}
            value={size.priceAdjustment}
            onChange={(event) =>
              onChange(index, "priceAdjustment", event.target.value)
            }
            className={cn(fieldClasses)}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className={cn(
              "text-red-500 hover:text-red-700 font-bold text-sm px-2 cursor-pointer",
            )}
          >
            {t("remove")}
          </button>
        </div>
      ))}

      {sizes.length === 0 && (
        <p className={cn("text-sm text-gray-500")}>{t("noSizesAdded")}</p>
      )}
    </div>
  );
};
