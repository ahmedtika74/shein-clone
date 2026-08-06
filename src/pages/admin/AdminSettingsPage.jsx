import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { useSettingsLogic } from "./AdminSettings/useSettingsLogic";
import { GeneralSettings } from "./AdminSettings/GeneralSettings";
import { LogoUploader } from "./AdminSettings/LogoUploader";
import { SocialLinks } from "./AdminSettings/SocialLinks";

export const AdminSettingsPage = () => {
  const { t } = useTranslation("admin");
  const logic = useSettingsLogic();

  return (
    <div className={cn("p-6 max-w-4xl mx-auto")}>
      <h1 className={cn("text-2xl font-bold mb-6 EGP")}>
        {t("siteSettings", { defaultValue: "Site Settings" })}
      </h1>

      <div
        className={cn(
          "bg-white p-6 rounded-lg shadow-sm border border-gray-100",
        )}
      >
        <form onSubmit={logic.handleSubmit} className={cn("space-y-6")}>
          <GeneralSettings {...logic} />
          <LogoUploader {...logic} />
          <SocialLinks {...logic} />

          {/* Submit */}
          <div className={cn("pt-4 flex items-center gap-4")}>
            <button
              type="submit"
              className={cn(
                "bg-[#e60023] text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors cursor-pointer",
              )}
            >
              {t("saveSettings")}
            </button>
            {logic.saveMessage && (
              <span
                className={cn(
                  "text-green-600 font-medium text-sm animate-fade-in",
                )}
              >
                {logic.saveMessage}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
