import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSiteSettings } from "../../store/dataSlice";
import { SEO } from "../../components/common/SEO";
import { useTranslation } from "react-i18next";

import { useAuthForms } from "./Auth/useAuthForms";
import { LoginForm } from "./Auth/LoginForm";
import { RegisterForm } from "./Auth/RegisterForm";
import { ForgotPasswordForm } from "./Auth/ForgotPasswordForm";

export const LoginPage = () => {
  const { t } = useTranslation("storefront");
  const siteSettings = useSelector(selectSiteSettings);
  const logic = useAuthForms();

  return (
    <div
      className={cn(
        "login-page min-h-[80vh] flex items-center justify-center py-12 px-4 bg-white",
      )}
    >
      <SEO title={t("signInRegister")} noindex={true} />
      <div
        className={cn(
          "login-box w-95 p-10 border border-gray-200 bg-white shadow-sm rounded-xl",
        )}
      >
        <div className={cn("login-logo text-center mb-6")}>
          <Link to="/">
            {siteSettings.type === "logo" ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName}
                className={cn("w-30 mx-auto")}
              />
            ) : (
              <div
                className={cn("text-2xl font-black tracking-tighter uppercase")}
              >
                {siteSettings.siteName}
              </div>
            )}
          </Link>
        </div>

        {logic.mode === "register" && <RegisterForm {...logic} />}
        {logic.mode === "forget" && <ForgotPasswordForm {...logic} />}
        {logic.mode === "login" && <LoginForm {...logic} />}
      </div>
    </div>
  );
};
