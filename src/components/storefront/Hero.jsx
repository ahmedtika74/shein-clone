import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import {
  selectHeroSlides,
  selectLeftSideCards,
  selectRightSideCards,
} from "../../store/dataSlice";
import { getLocalizedString } from "../../utils/localization";
import { getImageUrl } from "../../utils/getImageUrl";

const SLIDE_INTERVAL_MS = 4000;

const SidePromoColumn = ({ cards }) => {
  const { i18n } = useTranslation();

  if (cards.length === 0) return null;

  return (
    <div
      className={cn(
        "w-full md:w-[18%] grid grid-cols-3 md:flex md:flex-col gap-2 md:gap-4 h-full",
      )}
    >
      {cards.map((card) => (
        <Link
          key={card.id}
          to={card.link || "/"}
          className={cn(
            "flex-1 relative overflow-hidden rounded-[10px] group cursor-pointer h-[100px] sm:h-[130px] md:h-auto block",
          )}
        >
          <img
            src={getImageUrl(card.imageUrl)}
            alt={getLocalizedString(card, "title", i18n.language)}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-108",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white transition-opacity group-hover:bg-black/40",
            )}
          >
            <h3
              className={cn(
                "text-sm sm:text-lg md:text-2xl font-bold mb-0.5 md:mb-2 drop-shadow text-center px-1 leading-tight",
              )}
            >
              {getLocalizedString(card, "title", i18n.language)}
            </h3>
            <p
              className={cn(
                "bg-white text-black px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-semibold shadow",
              )}
            >
              {getLocalizedString(card, "actionText", i18n.language)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const HeroSlider = ({ slides }) => {
  const { t } = useTranslation("storefront");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const step = (delta) =>
    setCurrentSlide((prev) => (prev + delta + slides.length) % slides.length);

  return (
    <div
      className={cn(
        "w-full md:w-[64%] h-[220px] sm:h-[350px] md:h-full relative overflow-hidden rounded-[10px] bg-gray-100 order-first md:order-none",
      )}
    >
      <div
        className={cn(
          "flex h-full transition-transform duration-700 ease-in-out ltr:translate-x-[calc(var(--slide-idx)*-100%)] rtl:translate-x-[calc(var(--slide-idx)*100%)]",
        )}
        style={{ "--slide-idx": currentSlide }}
      >
        {slides.map((slide, index) => (
          <Link
            key={slide.id}
            to={slide.link || "/"}
            className={cn("min-w-full h-full shrink-0 block")}
          >
            <img
              src={getImageUrl(slide.imageUrl)}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
              className={cn("w-full h-full object-cover bg-gray-100")}
            />
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t("previousSlide")}
            className={cn(
              "absolute start-[15px] top-1/2 -translate-y-1/2 w-11.25 h-11.25 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-lg transition-all cursor-pointer z-10",
            )}
          >
            <i
              className={cn("fa-solid fa-chevron-left text-lg rtl:rotate-180")}
            />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t("nextSlide")}
            className={cn(
              "absolute end-3.75 top-1/2 -translate-y-1/2 w-11.25 h-11.25 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-lg transition-all cursor-pointer z-10",
            )}
          >
            <i
              className={cn("fa-solid fa-chevron-right text-lg rtl:rotate-180")}
            />
          </button>

          <div
            className={cn(
              "absolute bottom-5 start-1/2 -translate-x-1/2 flex items-center gap-2 z-10",
            )}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={t("goToSlide", { number: index + 1 })}
                aria-current={currentSlide === index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all cursor-pointer bg-white",
                  currentSlide === index
                    ? "opacity-100 scale-110"
                    : "opacity-50 hover:opacity-80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const Hero = () => {
  const heroSlides = useSelector(selectHeroSlides);
  const leftSideCards = useSelector(selectLeftSideCards);
  const rightSideCards = useSelector(selectRightSideCards);

  const hasContent =
    heroSlides.length > 0 ||
    leftSideCards.length > 0 ||
    rightSideCards.length > 0;

  if (!hasContent) return null;

  return (
    <section
      className={cn(
        "w-[95%] max-w-7xl mx-auto my-4 md:my-[30px] flex flex-col md:flex-row gap-4 md:h-[520px]",
      )}
    >
      <SidePromoColumn cards={leftSideCards} />
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}
      <SidePromoColumn cards={rightSideCards} />
    </section>
  );
};
