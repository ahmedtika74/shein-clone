import { cn } from "../../utils/cn";
import { CategoriesGrid } from "./AdminCategories/CategoriesGrid";
import { CategoryForm } from "./AdminCategories/CategoryForm";
import { useCategoriesLogic } from "./AdminCategories/useCategoriesLogic";
import { useTranslation } from "react-i18next";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation(["admin", "common"]);
  const logic = useCategoriesLogic();

  return (
    <div>
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center mb-8",
        )}
      >
        <h1 className={cn("text-3xl font-bold text-gray-900")}>
          {t("manageCategories")}
        </h1>
        <button
          onClick={logic.resetForm}
          className={cn(
            "bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e60023] transition-colors",
          )}
        >
          {t("addNewCategory")}
        </button>
      </div>

      <CategoriesGrid
        categories={logic.categories}
        handleEdit={logic.handleEdit}
        handleDelete={logic.handleDelete}
        isLoading={logic.isLoading}
      />

      <CategoryForm {...logic} />
    </div>
  );
};
