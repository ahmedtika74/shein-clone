import { cn } from "../../../utils/cn";
import { Input, Button } from "../../../components/ui";
import { useTranslation } from "react-i18next";

export const ForgotPasswordForm = ({
  handleForgetSubmit,
  forgetEmail,
  setForgetEmail,
  resetMethod,
  setResetMethod,
  setMode,
  forgetMsg,
}) => {
  const { t } = useTranslation("storefront");
  return (
    <form onSubmit={handleForgetSubmit}>
      <h2 className={cn("text-center text-2xl font-bold mb-4 text-gray-900")}>
        {t("resetPassword")}
      </h2>
      <p className={cn("text-xs text-gray-500 text-center mb-6")}>
        {t("resetInstructions")}
      </p>
      <div className={cn("relative mb-4")}>
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
        />
      </div>
      <div className={cn("mb-6")}>
        <label className={cn("block text-xs font-semibold text-gray-700 mb-2")}>
          {t("resetMethod")}
        </label>
        <select
          value={resetMethod}
          onChange={(e) => setResetMethod(e.target.value)}
          className={cn(
            "w-full h-11 border border-gray-300 rounded-md px-3 text-sm outline-none bg-white",
          )}
        >
          <option value="email">{t("sendViaEmail")}</option>
          <option value="phone">{t("sendViaSms")}</option>
        </select>
      </div>
      <Button type="submit" className={cn("w-full h-12")}>
        {t("sendInstructionsBtn")}
      </Button>
      {forgetMsg.text && (
        <p
          className={cn(
            `msg mt-3 text-xs text-center font-bold ${forgetMsg.isError ? "text-red-600" : "text-green-600"}`,
          )}
        >
          {forgetMsg.text}
        </p>
      )}
      <div className={cn("register text-center mt-6 text-sm text-gray-600")}>
        {t("backTo")}{" "}
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn("font-bold text-black hover:underline cursor-pointer")}
        >
          {t("loginTitle")}
        </button>
      </div>
    </form>
  );
};
