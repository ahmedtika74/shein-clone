import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import {
  loginAdminThunk,
  selectAuthStatus,
  selectIsAdminLoggedIn,
} from "../../store/authSlice";
import { selectSiteSettings } from "../../store/dataSlice";
import { Input, Button } from "../../components/ui";
import { getImageUrl } from "../../utils/getImageUrl";

export const AdminLoginPage = () => {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdminLoggedIn = useSelector(selectIsAdminLoggedIn);
  const isLoading = useSelector(selectAuthStatus) === "loading";
  const siteSettings = useSelector(selectSiteSettings);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (isAdminLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await dispatch(loginAdminThunk({ username, password })).unwrap();
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error || t("loginFailed"));
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-100 flex items-center justify-center p-4",
      )}
    >
      <div
        className={cn(
          "bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border border-gray-200",
        )}
      >
        <div className={cn("text-center mb-8")}>
          <Link to="/">
            {siteSettings.logoUrl ? (
              <img
                src={getImageUrl(siteSettings.logoUrl)}
                alt={siteSettings.siteName}
                className={cn("w-30 mx-auto mb-4")}
              />
            ) : (
              <div
                className={cn(
                  "text-2xl font-black tracking-tighter uppercase mb-4",
                )}
              >
                {siteSettings.siteName}
              </div>
            )}
          </Link>
          <h1 className={cn("text-2xl font-bold text-gray-900")}>
            {t("adminLogin")}
          </h1>
          <p className={cn("text-xs text-gray-500 mt-1")}>
            {t("adminLoginSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={cn("space-y-4")}>
          <div className={cn("relative")}>
            <i
              className={cn(
                "fa-regular fa-user text-gray-400 absolute start-4 top-[38px] z-10",
              )}
            ></i>
            <Input
              label={t("username")}
              type="text"
              autoComplete="username"
              placeholder={t("enterUsername")}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={cn("ps-11 h-12")}
            />
          </div>

          <div className={cn("relative")}>
            <i
              className={cn(
                "fa-solid fa-lock text-gray-400 absolute start-4 top-[38px] z-10",
              )}
            ></i>
            <Input
              label={t("password")}
              type="password"
              autoComplete="current-password"
              placeholder={t("enterPassword")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={cn("ps-11 h-12")}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={cn("w-full py-3 h-12")}
          >
            {isLoading ? t("signingIn") : t("signIn")}
          </Button>

          {errorMessage && (
            <p
              className={cn("text-center text-xs font-bold text-red-600 mt-3")}
              role="alert"
            >
              {errorMessage}
            </p>
          )}
        </form>

        <div className={cn("mt-8 text-center border-t border-gray-200 pt-4")}>
          <Link
            to="/"
            className={cn(
              "text-xs font-bold text-gray-500 hover:text-black transition-colors",
            )}
          >
            &larr; {t("backToStorefront")}
          </Link>
        </div>
      </div>
    </div>
  );
};
