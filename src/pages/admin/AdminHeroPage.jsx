import { cn } from "../../utils/cn";
import { useHeroLogic } from "./AdminHero/useHeroLogic";
import { HeroSlidesList } from "./AdminHero/HeroSlidesList";
import { SlideForm } from "./AdminHero/SlideForm";
import { SideCardGrid } from "./AdminHero/SideCardGrid";
import { useTranslation } from "react-i18next";

export const AdminHeroPage = () => {
  const { t } = useTranslation("admin");
  const logic = useHeroLogic();

  return (
    <div>
      <h1 className={cn("text-3xl font-bold text-gray-900 mb-8")}>
        {t("manageHeroSection")}
      </h1>

      <div className={cn("mb-12")}>
        <h2
          className={cn("text-xl font-bold text-gray-800 mb-6 border-b pb-2")}
        >
          {t("mainSliderBanners")}
        </h2>

        <HeroSlidesList
          heroSlides={logic.heroSlides}
          handleDeleteSlide={logic.handleDeleteSlide}
        />

        <SlideForm {...logic} />
      </div>

      <div className={cn("mb-12")}>
        <h2
          className={cn("text-xl font-bold text-gray-800 mb-6 border-b pb-2")}
        >
          {t("leftSideCards")}
        </h2>
        <SideCardGrid cards={logic.leftSideCards} side="left" />
      </div>

      <div className={cn("mb-12")}>
        <h2
          className={cn("text-xl font-bold text-gray-800 mb-6 border-b pb-2")}
        >
          {t("rightSideCards")}
        </h2>
        <SideCardGrid cards={logic.rightSideCards} side="right" />
      </div>
    </div>
  );
};
