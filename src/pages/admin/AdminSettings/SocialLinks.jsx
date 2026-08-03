import { cn } from "../../../utils/cn";
import { Input } from "../../../components/ui";

export const SocialLinks = ({ settings, handleSocialChange }) => {
  return (
    <div className={cn("pt-4 border-t border-gray-100")}>
      <h2 className={cn("text-lg font-bold mb-4")}>Social Links</h2>
      <div className={cn("space-y-4")}>
        <Input
          label="Facebook URL"
          type="url"
          name="facebook"
          value={settings.socialLinks?.facebook || ""}
          onChange={handleSocialChange}
          placeholder="https://facebook.com/yourpage"
        />
        <Input
          label="Instagram URL"
          type="url"
          name="instagram"
          value={settings.socialLinks?.instagram || ""}
          onChange={handleSocialChange}
          placeholder="https://instagram.com/yourprofile"
        />
        <Input
          label="TikTok URL"
          type="url"
          name="tiktok"
          value={settings.socialLinks?.tiktok || ""}
          onChange={handleSocialChange}
          placeholder="https://tiktok.com/@yourprofile"
        />
        <Input
          label="YouTube URL"
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
