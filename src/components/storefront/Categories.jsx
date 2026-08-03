import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCategories } from "../../store/dataSlice";

export const Categories = () => {
  const categories = useSelector(selectCategories);

  return (
    <section className={cn("w-[95%] max-w-7xl mx-auto my-15")}>
      <h2
        className={cn(
          "text-center text-2xl md:text-[32px] font-bold mb-8.75 tracking-tight",
        )}
      >
        Trending Categories
      </h2>
      <div
        className={cn(
          "grid grid-cols-3 md:flex justify-items-center md:justify-between items-start md:items-center gap-3 sm:gap-4 md:gap-5",
        )}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/?category=${encodeURIComponent(cat.name)}`}
            className={cn(
              "category flex flex-col items-center cursor-pointer group text-center",
            )}
          >
            <div
              className={cn(
                "w-24 h-24 sm:w-32 sm:h-32 md:w-42.5 md:h-42.5 rounded-full overflow-hidden shadow-sm bg-gray-100",
              )}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-400 group-hover:scale-108",
                )}
              />
            </div>
            <p
              className={cn(
                "mt-2 md:mt-3 text-[11px] sm:text-sm md:text-[18px] font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight",
              )}
            >
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};
