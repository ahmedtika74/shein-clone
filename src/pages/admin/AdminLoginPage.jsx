import { cn } from "../../utils/cn";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAdminThunk,
  selectAuthResult,
  clearAuthResult,
  selectAuthStatus,
} from "../../store/authSlice";
import { selectSiteSettings } from "../../store/dataSlice";
import { Input, Button } from "../../components/ui";

export const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authResult = useSelector(selectAuthResult);
  const authStatus = useSelector(selectAuthStatus);
  const siteSettings = useSelector(selectSiteSettings);
  const isLoading = authStatus === "loading";

  useEffect(() => {
    if (authResult) {
      if (authResult.success) {
        navigate("/admin/dashboard");
      } else {
        setMsg(authResult.message);
      }
      dispatch(clearAuthResult());
    }
  }, [authResult, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdminThunk({ username, password }));
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
            {siteSettings.type === "logo" ? (
              <img
                src={siteSettings.logoUrl}
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
          <h2 className={cn("text-2xl font-bold text-gray-900")}>
            Admin Login
          </h2>
          <p className={cn("text-xs text-gray-500 mt-1")}>
            Please log in to access the {siteSettings.siteName} Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className={cn("space-y-4")}>
          <div className={cn("relative")}>
            <i
              className={cn(
                "fa-regular fa-user text-gray-400 absolute left-4 top-[38px] z-10",
              )}
            ></i>
            <Input
              label="Username"
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn("pl-11 h-12")}
            />
          </div>

          <div className={cn("relative")}>
            <i
              className={cn(
                "fa-solid fa-lock text-gray-400 absolute left-4 top-[38px] z-10",
              )}
            ></i>
            <Input
              label="Password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn("pl-11 h-12")}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={cn("w-full py-3 h-12")}
          >
            {isLoading ? "Signing in..." : "Sign In to Admin Panel"}
          </Button>

          {msg && (
            <p
              className={cn("text-center text-xs font-bold text-red-600 mt-3")}
            >
              {msg}
            </p>
          )}
        </form>

        <div className={cn("mt-8 text-center border-t pt-4")}>
          <Link
            to="/"
            className={cn(
              "text-xs font-bold text-gray-500 hover:text-black transition-colors",
            )}
          >
            &larr; Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
