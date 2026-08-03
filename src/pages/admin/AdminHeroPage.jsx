import { cn } from "../../utils/cn";
import { useHeroLogic } from "./AdminHero/useHeroLogic";
import { HeroSlidesList } from "./AdminHero/HeroSlidesList";
import { SlideForm } from "./AdminHero/SlideForm";
import { SideCardGrid } from "./AdminHero/SideCardGrid";

export const AdminHeroPage = () => {
  const logic = useHeroLogic();

  return (
    <div>
      <h1 className={cn("text-3xl font-bold text-gray-900 mb-8")}>
        Manage Hero Section
      </h1>

      <div className={cn("mb-12")}>
        <h2
          className={cn("text-xl font-bold text-gray-800 mb-6 border-b pb-2")}
        >
          Main Slider Banners
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
          Left Side Cards
        </h2>
        <SideCardGrid cards={logic.leftSideCards} side="left" />
      </div>

      <div className={cn("mb-12")}>
        <h2
          className={cn("text-xl font-bold text-gray-800 mb-6 border-b pb-2")}
        >
          Right Side Cards
        </h2>
        <SideCardGrid cards={logic.rightSideCards} side="right" />
      </div>
    </div>
  );
};
