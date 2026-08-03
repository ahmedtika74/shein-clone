import { cn } from "../../../utils/cn";

export const SizePicker = ({
  selectedSizes,
  handleAddSize,
  handleRemoveSize,
  handleSizeChange,
}) => {
  return (
    <div
      className={cn(
        "col-span-1 md:col-span-4 flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200",
      )}
    >
      <div className={cn("flex justify-between items-center")}>
        <label className={cn("font-bold text-sm text-gray-800")}>
          Product Sizes
        </label>
        <button
          type="button"
          onClick={handleAddSize}
          className={cn(
            "text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800",
          )}
        >
          + Add Size
        </button>
      </div>
      {selectedSizes.map((size, idx) => (
        <div
          key={idx}
          className={cn(
            "flex flex-wrap md:flex-nowrap gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm",
          )}
        >
          <input
            type="text"
            placeholder="Size (e.g. M, 38)"
            value={size.name || ""}
            onChange={(e) => handleSizeChange(idx, "name", e.target.value)}
            className={cn(
              "flex-1 min-w-[150px] h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm",
            )}
          />
          <input
            type="number"
            placeholder="Price Adj (e.g. 10)"
            value={size.priceAdjustment || ""}
            onChange={(e) =>
              handleSizeChange(idx, "priceAdjustment", e.target.value)
            }
            className={cn(
              "flex-1 min-w-[150px] h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm",
            )}
          />
          <button
            type="button"
            onClick={() => handleRemoveSize(idx)}
            className={cn(
              "text-red-500 hover:text-red-700 font-bold text-sm px-2",
            )}
          >
            Remove
          </button>
        </div>
      ))}
      {selectedSizes.length === 0 && (
        <p className={cn("text-sm text-gray-500")}>
          No sizes added. Defaulting to Free Size.
        </p>
      )}
    </div>
  );
};
