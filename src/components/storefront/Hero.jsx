import { cn } from "../../utils/cn";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectHeroSlides,
  selectLeftSideCards,
  selectRightSideCards,
} from "../../store/dataSlice";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "../../utils/localization";

export const Hero = () => {
  const { i18n } = useTranslation();
  const heroSlides = useSelector(selectHeroSlides);
  const leftSideCards = useSelector(selectLeftSideCards);
  const rightSideCards = useSelector(selectRightSideCards);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section
      className={cn(
        "w-[95%] max-w-7xl mx-auto my-4 md:my-[30px] flex flex-col md:flex-row gap-4 md:h-[520px]",
      )}
    >
      {/* Left Side Promo Cards */}
      <div
        className={cn(
          "w-full md:w-[18%] grid grid-cols-3 md:flex md:flex-col gap-2 md:gap-4 h-full",
        )}
      >
        {leftSideCards.map((card, idx) => (
          <Link
            to={card.link || "#"}
            key={`left-${idx}`}
            className={cn(
              "flex-1 relative overflow-hidden rounded-[10px] group cursor-pointer h-[100px] sm:h-[130px] md:h-auto block",
            )}
          >
            <img
              src={card.img}
              alt={card.title}
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
                  "bg-white text-black px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-semibold hover:bg-gray-100 transition-colors shadow",
                )}
              >
                {getLocalizedString(card, "actionText", i18n.language)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Slider */}
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
          {heroSlides.map((slide, idx) => (
            <Link
              key={slide.img || slide}
              to={slide.link || "#"}
              className={cn("min-w-full h-full shrink-0 block")}
            >
              <img
                src={slide.img || slide}
                alt={`Slide ${idx + 1}`}
                className={cn("w-full h-full object-cover bg-gray-100")}
              />
            </Link>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className={cn(
            "absolute start-[15px] top-1/2 -translate-y-1/2 w-11.25 h-11.25 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-lg transition-all cursor-pointer z-10",
          )}
          aria-label="Previous Slide"
        >
          <i className={cn("fa-solid fa-chevron-left text-lg")}></i>
        </button>
        <button
          onClick={nextSlide}
          className={cn(
            "absolute end-3.75 top-1/2 -translate-y-1/2 w-11.25 h-11.25 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-lg transition-all cursor-pointer z-10",
          )}
          aria-label="Next Slide"
        >
          <i className={cn("fa-solid fa-chevron-right text-lg")}></i>
        </button>
        <div
          className={cn(
            "absolute bottom-5 start-1/2 -translate-x-1/2 flex items-center gap-2 z-10",
          )}
        >
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.img || slide}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                `w-3 h-3 rounded-full transition-all cursor-pointer ${currentSlide === idx ? "bg-white opacity-100 scale-110" : "bg-white opacity-50 hover:opacity-80"}`,
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Side Promo Cards */}
      <div
        className={cn(
          "w-full md:w-[18%] grid grid-cols-3 md:flex md:flex-col gap-2 md:gap-4 h-full",
        )}
      >
        {rightSideCards.map((card, idx) => (
          <Link
            to={card.link || "#"}
            key={`right-${idx}`}
            className={cn(
              "flex-1 relative overflow-hidden rounded-[10px] group cursor-pointer h-[100px] sm:h-[130px] md:h-auto block",
            )}
          >
            <img
              src={card.img}
              alt={card.title}
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
                  "bg-white text-black px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-semibold hover:bg-gray-100 transition-colors shadow",
                )}
              >
                {getLocalizedString(card, "actionText", i18n.language)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
