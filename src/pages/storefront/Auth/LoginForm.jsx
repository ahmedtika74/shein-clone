import { cn } from "../../../utils/cn";
import { Input, Button } from "../../../components/ui";
import { useTranslation } from "react-i18next";

export const LoginForm = ({
  handleLoginSubmit,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  setMode,
  isLoading,
  loginMsg,
}) => {
  const { t } = useTranslation("storefront");
  return (
    <form onSubmit={handleLoginSubmit}>
      <h2 className={cn("text-center text-2xl font-bold mb-6 text-gray-900")}>
        {t("loginTitle")}
      </h2>
      <div className={cn("relative mb-4")}>
        <i
          className={cn(
            "fa-regular fa-envelope text-gray-500 absolute start-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="email"
          placeholder={t("emailAddress")}
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className={cn("ps-11 h-12")}
        />
      </div>
      <div className={cn("relative mb-2")}>
        <i
          className={cn(
            "fa-solid fa-lock text-gray-500 absolute start-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="password"
          placeholder={t("password")}
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className={cn("ps-11 h-12")}
        />
      </div>
      <div className={cn("forget text-end mb-5")}>
        <button
          type="button"
          onClick={() => setMode("forget")}
          className={cn(
            "text-xs text-gray-600 hover:text-black font-semibold cursor-pointer",
          )}
        >
          {t("forgotPassword")}
        </button>
      </div>
      <Button type="submit" disabled={isLoading} className={cn("w-full h-12")}>
        {isLoading ? t("signingIn") : t("signIn")}
      </Button>
      {loginMsg.text && (
        <p
          className={cn(
            `msg mt-3 text-xs text-center font-bold ${loginMsg.isError ? "text-red-600" : "text-green-600"}`,
          )}
        >
          {loginMsg.text}
        </p>
      )}
      <div
        className={cn(
          "or text-center my-5 text-xs text-gray-400 font-semibold tracking-wider uppercase",
        )}
      >
        {t("or")}
      </div>
      <Button
        type="button"
        variant="secondary"
        className={cn("w-full h-12 flex items-center justify-center gap-2")}
      >
        <i className={cn("fa-brands fa-google text-red-500 text-base")}></i>{" "}
        {t("continueWithGoogle")}
      </Button>
      <div className={cn("register text-center mt-6 text-sm text-gray-600")}>
        {t("noAccount")}{" "}
        <button
          type="button"
          onClick={() => setMode("register")}
          className={cn("font-bold text-black hover:underline cursor-pointer")}
        >
          {t("register")}
        </button>
      </div>
    </form>
  );
};
