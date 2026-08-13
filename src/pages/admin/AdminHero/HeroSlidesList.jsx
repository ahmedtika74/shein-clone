import { cn } from "../../../utils/cn";
import { Card, CardContent, Button } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../../utils/getImageUrl";

export const HeroSlidesList = ({
  heroSlides,
  handleEditSlide,
  handleDeleteSlide,
  isLoading,
}) => {
  const { t } = useTranslation("admin");
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
      )}
    >
      {heroSlides.map((slide, index) => (
        <Card
          key={slide.id || `hero-${index}`}
          className={cn("relative group p-0 overflow-hidden")}
        >
          <CardContent className={cn("p-4")}>
            <img
              src={getImageUrl(slide.imageUrl)}
              alt={`Slide ${index + 1}`}
              className={cn("w-full h-48 object-cover rounded-xl")}
            />
            <div className={cn("mt-3")}>
              <div className={cn("flex justify-between items-center mb-1")}>
                <span className={cn("text-xs font-bold text-gray-600")}>
                  {t("slideHash")}
                  {index + 1}
                </span>
                <div className={cn("flex gap-1")}>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleEditSlide(slide)}
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleDeleteSlide(slide.id)}
                    className={cn("text-red-600")}
                  >
                    {t("delete")}
                  </Button>
                </div>
              </div>
              <p className={cn("text-[10px] text-gray-500 truncate")}>
                {t("linkLabel")}{" "}
                <span className={cn("text-blue-500")}>
                  {slide.link || t("none")}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      {heroSlides.length === 0 && (
        <p className={cn("text-gray-500 col-span-full text-center py-4")}>
          {t("noHeroSlides")}
        </p>
      )}
    </div>
  );
};
