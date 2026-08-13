import { cn } from "../../../utils/cn";
import { getImageUrl } from "../../../utils/getImageUrl";

export const ProductGallery = ({
  imagesList,
  selectedImg,
  setSelectedImg,
  productName,
}) => {
  return (
    <div className={cn("details-image w-full md:w-1/2")}>
      <div
        className={cn(
          "w-full h-112.5 md:h-150 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-gray-50",
        )}
      >
        <img
          src={getImageUrl(selectedImg)}
          alt={productName}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
          )}
        />
      </div>
      {imagesList.length > 1 && (
        <div className={cn("gallery flex gap-3 mt-4 overflow-x-auto pb-2")}>
          {imagesList.map((imgUrl, idx) => (
            <img
              key={imgUrl || `img-${idx}`}
              src={getImageUrl(imgUrl)}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => setSelectedImg(imgUrl)}
              className={cn(
                `w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  selectedImg === imgUrl
                    ? "border-black scale-105 shadow-md"
                    : "border-gray-200 opacity-70 hover:opacity-100"
                }`,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
