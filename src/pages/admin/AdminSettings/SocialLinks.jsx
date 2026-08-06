import { cn } from "../../../utils/cn";
import { Input } from "../../../components/ui";
import { useTranslation } from "react-i18next";

export const SocialLinks = ({ settings, handleSocialChange }) => {
  const { t } = useTranslation("admin");
  return (
    <div className={cn("pt-4 border-t border-gray-100")}>
      <h2 className={cn("text-lg font-bold mb-4")}>{t("socialLinks")}</h2>
      <div className={cn("space-y-4")}>
        <Input
          label={t("facebookUrl")}
          type="url"
          name="facebook"
          value={settings.socialLinks?.facebook || ""}
          onChange={handleSocialChange}
          placeholder="https://facebook.com/yourpage"
        />
        <Input
          label={t("instagramUrl")}
          type="url"
          name="instagram"
          value={settings.socialLinks?.instagram || ""}
          onChange={handleSocialChange}
          placeholder="https://instagram.com/yourprofile"
        />
        <Input
          label={t("tiktokUrl")}
          type="url"
          name="tiktok"
          value={settings.socialLinks?.tiktok || ""}
          onChange={handleSocialChange}
          placeholder="https://tiktok.com/@yourprofile"
        />
        <Input
          label={t("youtubeUrl")}
          type="url"
          name="youtube"
          value={settings.socialLinks?.youtube || ""}
          onChange={handleSocialChange}
          placeholder="https://youtube.com/c/yourchannel"
        />
      </div>
    </div>
  );
};
