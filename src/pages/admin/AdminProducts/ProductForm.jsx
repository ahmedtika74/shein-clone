import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { ColorPicker } from "./ColorPicker";
import { SizePicker } from "./SizePicker";
import { VariantsStockPicker } from "./VariantsStockPicker";
import { ImageUrlListField } from "../../../components/admin/ImageUrlField";
import { Input, Button } from "../../../components/ui";
import { getLocalizedString } from "../../../utils/localization";

export const ProductForm = ({
  form,
  setField,
  isEditing,
  errorMessage,
  resetForm,
  handleSave,
  addColor,
  removeColor,
  changeColor,
  addSize,
  removeSize,
  changeSize,
  changeVariantStock,
  categories,
  onClose,
}) => {
  const { t, i18n } = useTranslation(["admin", "common"]);

  return (
    <form onSubmit={handleSave} className={cn("space-y-6 w-full")}>
      <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6")}>
        <Input
          label={`${t("productName")} (English)`}
          value={form.nameEn}
          onChange={(event) => setField("nameEn")(event.target.value)}
          placeholder={`${t("egProductName")} (EN)`}
        />
        <Input
          label={`${t("productName")} (Arabic)`}
          value={form.nameAr}
          onChange={(event) => setField("nameAr")(event.target.value)}
          placeholder={`${t("egProductName")} (AR)`}
        />
        <Input
          label={t("descriptionEn")}
          value={form.descriptionEn}
          onChange={(event) => setField("descriptionEn")(event.target.value)}
          placeholder={t("descriptionPlaceholderEn")}
        />
        <Input
          label={t("descriptionAr")}
          value={form.descriptionAr}
          onChange={(event) => setField("descriptionAr")(event.target.value)}
          placeholder={t("descriptionPlaceholderAr")}
        />

        <Input
          label={t("newPriceEgp")}
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(event) => setField("price")(event.target.value)}
          placeholder={t("egp25")}
        />
        <Input
          label={t("oldPriceEgp")}
          type="number"
          min="0"
          step="0.01"
          value={form.oldPrice}
          onChange={(event) => setField("oldPrice")(event.target.value)}
          placeholder={t("egp40")}
        />

        <div className={cn("flex flex-col gap-2")}>
          <label
            htmlFor="product-category"
            className={cn("font-bold text-sm text-gray-800")}
          >
            {t("category")}
          </label>
          <select
            id="product-category"
            value={form.categoryId}
            onChange={(event) => setField("categoryId")(event.target.value)}
            className={cn(
              "h-11 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#e60023] text-sm bg-white",
            )}
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {getLocalizedString(category, "name", i18n.language)}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t("offerBadge")}
          value={form.offerBadge}
          onChange={(event) => setField("offerBadge")(event.target.value)}
          placeholder={t("egOffer")}
        />

        <Input
          label={t("mainImageIndex")}
          type="number"
          min="0"
          value={form.mainIndex}
          onChange={(event) => setField("mainIndex")(event.target.value)}
          placeholder="0"
        />

        <ColorPicker
          colors={form.colors}
          onAdd={addColor}
          onRemove={removeColor}
          onChange={changeColor}
        />

        <SizePicker
          sizes={form.sizes}
          onAdd={addSize}
          onRemove={removeSize}
          onChange={changeSize}
        />

        <VariantsStockPicker
          colors={form.colors}
          sizes={form.sizes}
          variantsStock={form.variantsStock}
          onChange={changeVariantStock}
        />
      </div>

      <ImageUrlListField
        label={t("productImages")}
        values={form.images}
        onChange={setField("images")}
        mainIndex={form.mainIndex}
      />

      {errorMessage && (
        <p className={cn("text-sm font-bold text-red-600")} role="alert">
          {errorMessage}
        </p>
      )}

      <div className={cn("flex gap-4")}>
        <Button
          type="submit"
          className={cn("w-56 h-11 bg-[#111] hover:bg-[#e60023]")}
        >
          {isEditing ? t("updateProduct") : t("saveProduct")}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              resetForm();
              onClose?.();
            }}
            className={cn("px-6 h-11")}
          >
            {t("cancelEdit")}
          </Button>
        )}
      </div>
    </form>
  );
};
