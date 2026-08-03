import { cn } from "../../../utils/cn";
import { Input } from "../../../components/ui";

export const VariantsStockPicker = ({
  selectedColors,
  selectedSizes,
  variantsStock,
  handleVariantStockChange,
}) => {
  if (
    !selectedColors ||
    !selectedSizes ||
    selectedColors.length === 0 ||
    selectedSizes.length === 0
  ) {
    return null;
  }

  return (
    <div className={cn("col-span-1 md:col-span-4 mt-4")}>
      <h3 className={cn("font-bold text-lg text-gray-800 mb-4")}>
        Variants Stock
      </h3>
      <div className={cn("overflow-x-auto border border-gray-200 rounded-lg")}>
        <table className={cn("min-w-full text-left bg-white")}>
          <thead className={cn("bg-gray-50 border-b border-gray-200")}>
            <tr>
              <th
                className={cn("px-4 py-3 text-sm font-semibold text-gray-700")}
              >
                Variant (Color - Size)
              </th>
              <th
                className={cn(
                  "px-4 py-3 text-sm font-semibold text-gray-700 w-48",
                )}
              >
                Stock Quantity
              </th>
            </tr>
          </thead>
          <tbody className={cn("divide-y divide-gray-100")}>
            {selectedColors.map((color) => {
              const cName = color.name || "Default";
              return selectedSizes.map((size) => {
                const sName = size.name || "Free Size";
                const variantKey = `${cName}-${sName}`;
                return (
                  <tr
                    key={variantKey}
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
                      <span>
                        {cName} - {sName}
                      </span>
                    </td>
                    <td className={cn("px-4 py-3")}>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={
                          variantsStock[variantKey] !== undefined
                            ? variantsStock[variantKey]
                            : 0
                        }
                        onChange={(e) =>
                          handleVariantStockChange(
                            variantKey,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className={cn("h-9 !mt-0")}
                        label=""
                      />
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
