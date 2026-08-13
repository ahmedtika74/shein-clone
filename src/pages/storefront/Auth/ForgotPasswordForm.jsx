import { cn } from "../../../utils/cn";
import { Input, Button } from "../../../components/ui";
import { useTranslation } from "react-i18next";

export const ForgotPasswordForm = ({
  handleForgetSubmit,
  forgetEmail,
  setForgetEmail,
  setMode,
  isLoading,
  forgetMsg,
}) => {
  const { t } = useTranslation("storefront");

  return (
    <form onSubmit={handleForgetSubmit}>
      <h2 className={cn("text-center text-2xl font-bold mb-3 text-gray-900")}>
        {t("resetPassword")}
      </h2>
      <p className={cn("text-center text-sm text-gray-500 mb-6")}>
        {t("resetInstructions")}
      </p>
      <div className={cn("relative mb-5")}>
        <i
          className={cn(
            "fa-regular fa-envelope text-gray-500 absolute start-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="email"
          placeholder={t("emailAddress")}
          value={forgetEmail}
          onChange={(e) => setForgetEmail(e.target.value)}
          className={cn("ps-11 h-12")}
          required
          autoComplete="email"
        />
      </div>
      <Button type="submit" disabled={isLoading} className={cn("w-full h-12")}>
        {isLoading ? t("sending") : t("sendResetLink")}
      </Button>
      {forgetMsg.text && (
        <p
          className={cn(
            `msg mt-3 text-xs text-center font-bold ${
              forgetMsg.isError ? "text-red-600" : "text-green-600"
            }`,
          )}
        >
          {forgetMsg.text}
        </p>
      )}
      <div className={cn("text-center mt-6 text-sm text-gray-600")}>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn("font-bold text-black hover:underline cursor-pointer")}
        >
          {t("backToLogin")}
        </button>
      </div>
    </form>
  );
};
