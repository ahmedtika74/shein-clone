import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";

export const LanguageSwitcher = ({ className, variant = "storefront" }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(nextLang);
  };

  if (variant === "admin") {
    return (
      <Button
        variant="ghost"
        onClick={toggleLanguage}
        className={cn(
          "flex items-center gap-3 p-3 w-full justify-start rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-start",
          className,
        )}
      >
        <i className={cn("fa-solid fa-globe w-5 text-center")}></i>
        <span className="font-medium">
          {i18n.language === "ar" ? "English" : "العربية"}
        </span>
      </Button>
    );
  }

  if (variant === "drawer") {
    return (
      <Button
        variant="ghost"
        onClick={toggleLanguage}
        className={cn(
          "w-full text-start px-6 py-4 border-b border-gray-100 flex items-center justify-between text-gray-800 hover:bg-gray-50 rounded-none",
          className,
        )}
      >
        <span className="flex items-center gap-3">
          <i className="fa-solid fa-globe text-gray-400"></i>
          {i18n.language === "ar" ? "English" : "العربية"}
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className={cn(
        "flex flex-col items-center justify-center w-12 h-12 rounded-full text-black relative",
        className,
      )}
      aria-label="Switch Language"
    >
      <i className={cn("fa-solid fa-globe text-xl")}></i>
      <span className={cn("text-[10px] font-medium mt-0.5 uppercase")}>
        {i18n.language === "ar" ? "EN" : "AR"}
      </span>
    </Button>
  );
};
