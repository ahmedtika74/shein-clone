import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { ColorPicker } from "./ColorPicker";
import { SizePicker } from "./SizePicker";
import { ImageUploader } from "./ImageUploader";
import { VariantsStockPicker } from "./VariantsStockPicker";
import { Input, Button } from "../../../components/ui";

export const ProductForm = ({
  editIndex,
  nameEn,
  setNameEn,
  nameAr,
  setNameAr,
  descriptionEn,
  setDescriptionEn,
  descriptionAr,
  setDescriptionAr,
  newPrice,
  setNewPrice,
  oldPrice,
  setOldPrice,
  mainIndex,
  setMainIndex,
  selectedColors,
  selectedSizes,
  category,
  setCategory,
  offer,
  setOffer,
  imagesBase64,
  setImagesBase64,
  imageInputUrl,
  setImageInputUrl,
  inputMode,
  setInputMode,
  handleFileUpload,
  handleAddUrl,
  handleAddColor,
  handleRemoveColor,
  handleColorChange,
  handleAddSize,
  handleRemoveSize,
  handleSizeChange,
  resetForm,
  handleSave,
  categories,
  variantsStock,
  handleVariantStockChange,
  onClose,
}) => {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <div className={cn("w-full")}>
      <form onSubmit={handleSave} className={cn("space-y-6")}>
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6")}>
          <Input
            label={`${t("productName")} (English)`}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder={`${t("egProductName")} (EN)`}
          />
          <Input
            label={`${t("productName")} (Arabic)`}
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder={`${t("egProductName")} (AR)`}
          />
          <Input
            label={`Description (English)`}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder={`Product description in English`}
          />
          <Input
            label={`Description (Arabic)`}
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder={`Product description in Arabic`}
          />

          <Input
            label={t("newPriceEgp")}
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder={t("egp25")}
          />

          <Input
            label={t("oldPriceEgp")}
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            placeholder={t("egp40")}
          />

          <div className={cn("flex flex-col gap-2")}>
            <label className={cn("font-bold text-sm text-gray-800")}>
              {t("category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cn(
                "h-11 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#e60023] text-sm bg-white",
              )}
            >
              <option value="">{t("selectCategory")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <ColorPicker
            selectedColors={selectedColors}
            handleAddColor={handleAddColor}
            handleRemoveColor={handleRemoveColor}
            handleColorChange={handleColorChange}
          />

          <SizePicker
            selectedSizes={selectedSizes}
            handleAddSize={handleAddSize}
            handleRemoveSize={handleRemoveSize}
            handleSizeChange={handleSizeChange}
          />

          <Input
            label={t("offerBadge")}
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder={t("egOffer")}
          />

          <Input
            label={t("mainImageIndex")}
            type="number"
            value={mainIndex}
            onChange={(e) => setMainIndex(e.target.value)}
            placeholder="0"
            min="0"
          />

          <VariantsStockPicker
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            variantsStock={variantsStock}
            handleVariantStockChange={handleVariantStockChange}
          />
        </div>

        <ImageUploader
          inputMode={inputMode}
          setInputMode={setInputMode}
          handleFileUpload={handleFileUpload}
          imageInputUrl={imageInputUrl}
          setImageInputUrl={setImageInputUrl}
          handleAddUrl={handleAddUrl}
          imagesBase64={imagesBase64}
          setImagesBase64={setImagesBase64}
          mainIndex={mainIndex}
        />

        <div className={cn("flex gap-4")}>
          <Button
            type="submit"
            className={cn("w-56 h-11 bg-[#111] hover:bg-[#e60023]")}
          >
            {editIndex === -1 ? t("saveProduct") : t("updateProduct")}
          </Button>
          {editIndex !== -1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                resetForm();
                if (onClose) onClose();
              }}
              className={cn("px-6 h-11")}
            >
              {t("cancelEdit")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
