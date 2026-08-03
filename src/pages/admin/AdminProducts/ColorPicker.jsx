import { cn } from "../../../utils/cn";

export const ColorPicker = ({
  selectedColors,
  handleAddColor,
  handleRemoveColor,
  handleColorChange,
}) => {
  return (
    <div
      className={cn(
        "col-span-1 md:col-span-4 flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200",
      )}
    >
      <div className={cn("flex justify-between items-center")}>
        <label className={cn("font-bold text-sm text-gray-800")}>
          Product Colors (Variants)
        </label>
        <button
          type="button"
          onClick={handleAddColor}
          className={cn(
            "text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800",
          )}
        >
          + Add Color
        </button>
      </div>
      {selectedColors.map((color, idx) => (
        <div
          key={idx}
          className={cn(
            "grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm",
          )}
        >
          <input
            type="text"
            placeholder="Color Name (e.g. Red)"
            value={color.name || ""}
            onChange={(e) => handleColorChange(idx, "name", e.target.value)}
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
              placeholder="Hex (e.g. #FF0000)"
              value={color.hex || ""}
              onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
              className={cn("w-full border-none outline-none text-sm")}
            />
          </div>
          <input
            type="text"
            placeholder="Image URL (Optional)"
            value={color.image || ""}
            onChange={(e) => handleColorChange(idx, "image", e.target.value)}
            className={cn(
              "h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#e60023] text-sm md:col-span-1",
            )}
          />
          <input
            type="number"
            placeholder="Specific Price (Optional)"
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
              "text-red-500 hover:text-red-700 font-bold text-sm ml-auto",
            )}
          >
            Remove
          </button>
        </div>
      ))}
      {selectedColors.length === 0 && (
        <p className={cn("text-sm text-gray-500")}>
          No colors added. Defaulting to standard variant.
        </p>
      )}
    </div>
  );
};
