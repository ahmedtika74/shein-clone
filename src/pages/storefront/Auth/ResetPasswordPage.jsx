import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { SEO } from "../../../components/common/SEO";
import { Input, Button } from "../../../components/ui";
import { resetPasswordThunk, selectAuthStatus } from "../../../store/authSlice";
import { selectSiteSettings } from "../../../store/dataSlice";

export const ResetPasswordPage = () => {
  const { t } = useTranslation("storefront");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const siteSettings = useSelector(selectSiteSettings);
  const isLoading = useSelector(selectAuthStatus) === "loading";

  const email = useMemo(
    () => searchParams.get("email")?.trim() || "",
    [searchParams],
  );
  const token = useMemo(
    () => searchParams.get("token")?.trim() || "",
    [searchParams],
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [done, setDone] = useState(false);

  const linkInvalid = !email || !token;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ text: "", isError: false });

    if (linkInvalid) {
      setMessage({ text: t("resetLinkInvalid"), isError: true });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setMessage({ text: t("passwordMinLength"), isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: t("passwordsDoNotMatch"), isError: true });
      return;
    }

    try {
      await dispatch(
        resetPasswordThunk({ email, token, newPassword }),
      ).unwrap();
      setDone(true);
      setMessage({ text: t("resetPasswordSuccess"), isError: false });
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (error) {
      setMessage({
        text: error || t("resetPasswordFailed"),
        isError: true,
      });
    }
  };

  return (
    <div
      className={cn(
        "min-h-[80vh] flex items-center justify-center py-12 px-4 bg-white pb-28 md:pb-12",
      )}
    >
      <SEO title={t("resetPassword")} noindex={true} />
      <div
        className={cn(
          "login-box w-95 p-8 sm:p-10 border border-gray-200 bg-white shadow-sm rounded-xl",
        )}
      >
        <div className={cn("text-center mb-6")}>
          <Link to="/">
            {siteSettings.type === "logo" && siteSettings.logoUrl ? (
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

        <h2 className={cn("text-center text-2xl font-bold mb-3 text-gray-900")}>
          {t("setNewPassword")}
        </h2>
        <p className={cn("text-center text-sm text-gray-500 mb-6")}>
          {t("setNewPasswordHint")}
        </p>

        {linkInvalid ? (
          <div className={cn("text-center space-y-4")}>
            <p className={cn("text-sm text-red-600 font-medium")}>
              {t("resetLinkInvalid")}
            </p>
            <Link
              to="/login"
              className={cn(
                "inline-block font-bold text-black hover:underline text-sm",
              )}
            >
              {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={cn("space-y-4")}>
            <Input
              type="email"
              label={t("email")}
              value={email}
              readOnly
              className={cn("bg-gray-50 cursor-not-allowed")}
            />
            <Input
              type="password"
              label={t("newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={done}
            />
            <Input
              type="password"
              label={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={done}
            />
            <Button
              type="submit"
              disabled={isLoading || done}
              className={cn("w-full h-12")}
            >
              {isLoading ? t("saving") : t("updatePassword")}
            </Button>
            {message.text && (
              <p
                className={cn(
                  "text-xs text-center font-bold",
                  message.isError ? "text-red-600" : "text-green-600",
                )}
              >
                {message.text}
              </p>
            )}
            <div className={cn("text-center text-sm")}>
              <Link
                to="/login"
                className={cn("font-bold text-black hover:underline")}
              >
                {t("backToLogin")}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
