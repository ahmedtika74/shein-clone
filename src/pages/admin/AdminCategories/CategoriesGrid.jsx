import { cn } from "../../../utils/cn";
import { Card, CardContent, Button } from "../../../components/ui";

export const CategoriesGrid = ({
  categories,
  handleEdit,
  handleDelete,
  isLoading,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12",
      )}
    >
      {categories.map((cat) => (
        <Card
          key={cat.id}
          className={cn(
            "shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px] p-0",
          )}
        >
          <CardContent className={cn("p-5 flex items-center justify-between")}>
            <div className={cn("flex items-center gap-4")}>
              <img
                src={cat.img}
                alt={cat.name}
                className={cn("w-16 h-16 rounded-full object-cover border")}
              />
              <div>
                <h3 className={cn("font-bold text-gray-900 text-base")}>
                  {cat.name}
                </h3>
                <span className={cn("text-xs text-gray-400")}>
                  ID: {cat.id}
                </span>
              </div>
            </div>
            <div className={cn("flex gap-2")}>
              <Button
                variant="primary"
                size="icon"
                onClick={() => handleEdit(cat)}
                className={cn(
                  "w-9 h-9 rounded-full bg-black hover:bg-blue-600",
                )}
                title="Edit Category"
              >
                <i className={cn("fa-solid fa-pen text-xs")}></i>
              </Button>
              <Button
                variant="primary"
                size="icon"
                onClick={() => handleDelete(cat.id)}
                disabled={isLoading}
                className={cn(
                  "w-9 h-9 rounded-full bg-black hover:bg-red-600 disabled:opacity-50",
                )}
                title="Delete Category"
              >
                <i className={cn("fa-solid fa-trash text-xs")}></i>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {categories.length === 0 && (
        <p className={cn("text-gray-500 col-span-full text-center py-4")}>
          No categories found.
        </p>
      )}
    </div>
  );
};
