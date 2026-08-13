import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import {
  getGoogleClientId,
  isGoogleSignInConfigured,
  loadGoogleIdentityScript,
} from "../../../utils/googleIdentity";

export const GoogleSignInButton = ({
  onCredential,
  disabled = false,
  className,
}) => {
  const { t, i18n } = useTranslation("storefront");
  const buttonHostRef = useRef(null);
  const onCredentialRef = useRef(onCredential);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!isGoogleSignInConfigured() || disabled) return undefined;

    let cancelled = false;
    const clientId = getGoogleClientId();

    const render = async () => {
      try {
        const google = await loadGoogleIdentityScript();
        if (cancelled || !buttonHostRef.current || !google?.accounts?.id) {
          return;
        }

        buttonHostRef.current.innerHTML = "";

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) {
              onCredentialRef.current?.(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const width = Math.min(
          Math.max(buttonHostRef.current.offsetWidth || 320, 240),
          400,
        );

        google.accounts.id.renderButton(buttonHostRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width,
          locale: i18n.language?.startsWith("ar") ? "ar" : "en",
        });
      } catch {
        if (!cancelled) setLoadError(t("googleSignInUnavailable"));
      }
    };

    render();

    return () => {
      cancelled = true;
      if (buttonHostRef.current) buttonHostRef.current.innerHTML = "";
    };
  }, [disabled, i18n.language, t]);

  if (!isGoogleSignInConfigured()) return null;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-3 my-5 text-xs text-gray-400 uppercase tracking-wide",
        )}
      >
        <span className={cn("flex-1 h-px bg-gray-200")} />
        <span>{t("orContinueWith")}</span>
        <span className={cn("flex-1 h-px bg-gray-200")} />
      </div>
      <div
        ref={buttonHostRef}
        className={cn(
          "w-full flex justify-center min-h-10",
          disabled && "pointer-events-none opacity-50",
        )}
        aria-label={t("continueWithGoogle")}
      />
      {loadError && (
        <p className={cn("mt-2 text-xs text-center font-bold text-red-600")}>
          {loadError}
        </p>
      )}
    </div>
  );
};
