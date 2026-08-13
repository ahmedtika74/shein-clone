import { cn } from "../../../utils/cn";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { ImageUrlField } from "../../../components/admin/ImageUrlField";
import { MediaUsageCategory } from "../../../services/mediaUpload";

export const CategoryForm = ({
  editId,
  catNameEn,
  setCatNameEn,
  catNameAr,
  setCatNameAr,
  catImg,
  setCatImg,
  formError,
  handleSubmit,
  resetForm,
  isLoading,
}) => {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <Card
      className={cn(
        "max-w-xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px]",
      )}
    >
      <CardHeader className={cn("border-b pb-3 mb-6")}>
        <CardTitle className={cn("text-xl")}>
          {editId
            ? t("editCategoryId", {
                id: editId,
                defaultValue: `Edit Category #${editId}`,
              })
            : t("addNewCategory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={cn("space-y-6")}>
          <Input
            label={`${t("categoryName")} (English)`}
            placeholder={`${t("egDresses")} (EN)`}
            value={catNameEn}
            onChange={(e) => setCatNameEn(e.target.value)}
            required
            className={cn("h-11")}
          />
          <Input
            label={`${t("categoryName")} (Arabic)`}
            placeholder={`${t("egDresses")} (AR)`}
            value={catNameAr}
            onChange={(e) => setCatNameAr(e.target.value)}
            required
            className={cn("h-11")}
          />

          <ImageUrlField
            label={t("categoryImage")}
            value={catImg}
            onChange={setCatImg}
            usageCategory={MediaUsageCategory.Category}
          />

          {formError && (
            <p className={cn("text-sm text-red-600 font-medium")}>{formError}</p>
          )}

          <div className={cn("flex gap-4 pt-4")}>
            <Button
              type="submit"
              disabled={isLoading}
              className={cn("flex-1 h-11 bg-[#111] hover:bg-[#e60023]")}
            >
              {isLoading
                ? t("saving")
                : editId
                  ? t("updateCategory")
                  : t("saveCategory")}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                className={cn("flex-1 h-11")}
              >
                {t("cancelEdit", { defaultValue: "Cancel" })}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
