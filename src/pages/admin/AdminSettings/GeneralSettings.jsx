import { cn } from "../../../utils/cn";
import { Input } from "../../../components/ui";
import { useTranslation } from "react-i18next";

export const GeneralSettings = ({ settings, handleChange }) => {
  const { t } = useTranslation("admin");
  return (
    <>
      <Input
        label={t("siteName")}
        name="siteName"
        value={settings.siteName}
        onChange={handleChange}
        placeholder={t("egSiteName")}
        required
      />

      <div>
        <label className={cn("block text-sm font-medium text-gray-700 mb-2")}>
          {t("displayMode")}
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
            <span className={cn("text-sm text-gray-700")}>
              {t("imageLogo")}
            </span>
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
              {t("textSiteName")}
            </span>
          </label>
        </div>
      </div>
    </>
  );
};
