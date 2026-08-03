import { cn } from "../../../utils/cn";
import { Input } from "../../../components/ui";

export const GeneralSettings = ({ settings, handleChange }) => {
  return (
    <>
      <Input
        label="Site Name"
        name="siteName"
        value={settings.siteName}
        onChange={handleChange}
        placeholder="e.g. SHEIN"
        required
      />

      <div>
        <label className={cn("block text-sm font-medium text-gray-700 mb-2")}>
          Display Mode
        </label>
        <div className={cn("flex items-center gap-6")}>
          <label className={cn("flex items-center gap-2 cursor-pointer")}>
            <input
              type="radio"
              name="type"
              value="logo"
              checked={settings.type === "logo"}
              onChange={handleChange}
              className={cn("accent-[#e60023] w-4 h-4")}
            />
            <span className={cn("text-sm text-gray-700")}>Image Logo</span>
          </label>
          <label className={cn("flex items-center gap-2 cursor-pointer")}>
            <input
              type="radio"
              name="type"
              value="text"
              checked={settings.type === "text"}
              onChange={handleChange}
              className={cn("accent-[#e60023] w-4 h-4")}
            />
            <span className={cn("text-sm text-gray-700")}>
              Text (Site Name)
            </span>
          </label>
        </div>
      </div>
    </>
  );
};
