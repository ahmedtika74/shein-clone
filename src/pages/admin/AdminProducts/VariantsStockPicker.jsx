import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { Input } from "../../../components/ui";
import { getVariantKey } from "../../../utils/variants";

export const VariantsStockPicker = ({
  colors,
  sizes,
  variantsStock,
  onChange,
}) => {
  const { t } = useTranslation("admin");

  if (colors.length === 0 || sizes.length === 0) return null;

  const rows = colors.flatMap((color, colorIndex) =>
    sizes.map((size, sizeIndex) => ({
      color,
      size,
      colorIndex,
      sizeIndex,
      stockKey: getVariantKey(color, size),
      rowKey: `${colorIndex}-${sizeIndex}`,
    })),
  );

  const stockKeyCounts = rows.reduce((counts, row) => {
    counts[row.stockKey] = (counts[row.stockKey] || 0) + 1;
    return counts;
  }, {});
  const hasDuplicateKeys = Object.values(stockKeyCounts).some((count) => count > 1);

  return (
    <div className={cn("col-span-1 md:col-span-4 mt-4")}>
      <h3 className={cn("font-bold text-lg text-gray-800 mb-4")}>
        {t("variantsStock")}
      </h3>

      {hasDuplicateKeys && (
        <p className={cn("text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3")}>
          {t("duplicateVariantKeys", {
            defaultValue:
              "Two colors share the same English name (or two sizes share a name). Stock keys must be unique — rename the color/size (e.g. Black / Black 2).",
          })}
        </p>
      )}

      <div className={cn("overflow-x-auto border border-gray-200 rounded-lg")}>
        <table className={cn("min-w-full text-start bg-white")}>
          <thead className={cn("bg-gray-50 border-b border-gray-200")}>
            <tr>
              <th
                className={cn("px-4 py-3 text-sm font-semibold text-gray-700")}
              >
                {t("variantColorSize")}
              </th>
              <th
                className={cn(
                  "px-4 py-3 text-sm font-semibold text-gray-700 w-48",
                )}
              >
                {t("stockQuantity")}
              </th>
            </tr>
          </thead>
          <tbody className={cn("divide-y divide-gray-100")}>
            {rows.map(({ color, stockKey, rowKey }) => (
              <tr
                key={rowKey}
                className={cn("hover:bg-gray-50 transition-colors")}
              >
                <td
                  className={cn(
                    "px-4 py-3 text-sm text-gray-800 flex items-center gap-2",
                  )}
                >
                  {color.hex && (
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border border-gray-300",
                      )}
                      style={{ backgroundColor: color.hex }}
                    ></span>
                  )}
                  <span>{stockKey}</span>
                  {stockKeyCounts[stockKey] > 1 && (
                    <span className={cn("text-xs font-bold text-amber-600")}>
                      !
                    </span>
                  )}
                </td>
                <td className={cn("px-4 py-3")}>
                  <Input
                    label=""
                    type="number"
                    min="0"
                    placeholder="0"
                    value={variantsStock[stockKey] ?? 0}
                    onChange={(event) =>
                      onChange(stockKey, parseInt(event.target.value, 10) || 0)
                    }
                    className={cn("h-9 !mt-0")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
