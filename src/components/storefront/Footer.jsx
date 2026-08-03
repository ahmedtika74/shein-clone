import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSiteSettings } from "../../store/dataSlice";

export const Footer = () => {
  const siteSettings = useSelector(selectSiteSettings);

  return (
    <footer className={cn("bg-[#111] text-white py-[50px]")}>
      <div
        className={cn(
          "w-[90%] max-w-7xl mx-auto flex justify-between flex-wrap gap-8",
        )}
      >
        <div className={cn("footer-box flex flex-col gap-[12px]")}>
          <h3 className={cn("text-lg font-bold mb-[15px]")}>Customer Care</h3>
          <Link
            to="#"
            className={cn("text-gray-300 hover:text-white transition-colors")}
          >
            Contact Us
          </Link>
          <Link
            to="#"
            className={cn("text-gray-300 hover:text-white transition-colors")}
          >
            Shipping
          </Link>
          <Link
            to="#"
            className={cn("text-gray-300 hover:text-white transition-colors")}
          >
            Returns
          </Link>
          <Link
            to="#"
            className={cn("text-gray-300 hover:text-white transition-colors")}
          >
            FAQ
          </Link>
        </div>

        <div className={cn("footer-box flex flex-col gap-[12px]")}>
          <h3 className={cn("text-lg font-bold mb-[15px]")}>Company</h3>
          <Link
            to="#"
            className={cn("text-gray-300 hover:text-white transition-colors")}
          >
            About Us
          </Link>
          <Link
            to="#"
            className={cn("text-gray-300 hover:text-white transition-colors")}
          >
            Careers
          </Link>
          <Link
            to="#"
            className={cn("text-gray-300 hover:text-white transition-colors")}
          >
            Privacy Policy
          </Link>
        </div>

        <div className={cn("footer-box flex flex-col gap-[12px]")}>
          <h3 className={cn("text-lg font-bold mb-[15px]")}>Follow Us</h3>
          <div
            className={cn("social flex items-center gap-[20px] text-[24px]")}
          >
            {siteSettings.socialLinks?.facebook && (
              <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className={cn("fa-brands fa-facebook hover:text-red-500 transition-colors")}></i>
              </a>
            )}
            {siteSettings.socialLinks?.instagram && (
              <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className={cn("fa-brands fa-instagram hover:text-red-500 transition-colors")}></i>
              </a>
            )}
            {siteSettings.socialLinks?.tiktok && (
              <a href={siteSettings.socialLinks.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                <i className={cn("fa-brands fa-tiktok hover:text-red-500 transition-colors")}></i>
              </a>
            )}
            {siteSettings.socialLinks?.youtube && (
              <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className={cn("fa-brands fa-youtube hover:text-red-500 transition-colors")}></i>
              </a>
            )}
            {(!siteSettings.socialLinks || (!siteSettings.socialLinks.facebook && !siteSettings.socialLinks.instagram && !siteSettings.socialLinks.tiktok && !siteSettings.socialLinks.youtube)) && (
              <>
                <i className={cn("fa-brands fa-facebook cursor-pointer hover:text-red-500 transition-colors")}></i>
                <i className={cn("fa-brands fa-instagram cursor-pointer hover:text-red-500 transition-colors")}></i>
                <i className={cn("fa-brands fa-tiktok cursor-pointer hover:text-red-500 transition-colors")}></i>
                <i className={cn("fa-brands fa-youtube cursor-pointer hover:text-red-500 transition-colors")}></i>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "w-[90%] max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500",
        )}
      >
        <p>
          &copy; {new Date().getFullYear()} {siteSettings.siteName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};
