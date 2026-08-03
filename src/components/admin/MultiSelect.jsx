import { cn } from "../../utils/cn";
import { useState, useRef, useEffect } from "react";

export const MultiSelect = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (e, option) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <div className={cn("relative w-full")} ref={wrapperRef}>
      <div
        className={cn(
          "min-h-[45px] p-2 border border-gray-300 rounded-lg flex flex-wrap gap-2 items-center cursor-pointer bg-white",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && (
          <span className={cn("text-gray-400 text-sm px-2")}>
            {placeholder}
          </span>
        )}
        {selected.map((item) => (
          <span
            key={item}
            className={cn(
              "bg-gray-100 border border-gray-200 text-gray-800 text-xs px-2 py-1 rounded-md flex items-center gap-1",
            )}
          >
            {item}
            <button
              type="button"
              onClick={(e) => removeOption(e, item)}
              className={cn("text-gray-500 hover:text-red-500 font-bold ml-1")}
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 flex flex-col",
          )}
        >
          <div className={cn("p-2 border-b border-gray-100")}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={cn(
                "w-full p-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black",
              )}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className={cn("overflow-y-auto p-1")}>
            {filteredOptions.length === 0 ? (
              <div className={cn("p-2 text-sm text-gray-500 text-center")}>
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    `p-2 text-sm cursor-pointer rounded-md flex items-center justify-between ${selected.includes(option) ? "bg-gray-50 font-semibold" : "hover:bg-gray-50"}`,
                  )}
                >
                  <span>{option}</span>
                  {selected.includes(option) && (
                    <i
                      className={cn("fa-solid fa-check text-black text-xs")}
                    ></i>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
