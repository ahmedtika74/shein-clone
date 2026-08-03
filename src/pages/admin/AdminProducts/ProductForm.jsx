import { cn } from "../../../utils/cn";
import { ColorPicker } from "./ColorPicker";
import { SizePicker } from "./SizePicker";
import { ImageUploader } from "./ImageUploader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "../../../components/ui";

export const ProductForm = ({
  editIndex,
  name,
  setName,
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
}) => {
  return (
    <Card
      className={cn(
        "p-8 md:p-10 shadow-[0_5px_25px_rgba(0,0,0,0.08)] rounded-[20px]",
      )}
    >
      <CardHeader className={cn("px-0 pt-0 border-b pb-4 mb-6")}>
        <CardTitle className={cn("text-2xl")}>
          {editIndex === -1 ? "Add Product" : `Edit Product (Editing)`}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("px-0 pb-0")}>
        <form onSubmit={handleSave} className={cn("space-y-6")}>
          <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6")}>
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Women Summer Dress"
            />

            <Input
              label="New Price (EGP)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="EGP 25"
            />

            <Input
              label="Old Price (EGP)"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              placeholder="EGP 40"
            />

            <div className={cn("flex flex-col gap-2")}>
              <label className={cn("font-bold text-sm text-gray-800")}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(
                  "h-11 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#e60023] text-sm bg-white",
                )}
              >
                <option value="">Select Category</option>
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
              label="Offer Badge"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="e.g. 20% OFF or FLASH"
            />

            <Input
              label="Main Image Index"
              type="number"
              value={mainIndex}
              onChange={(e) => setMainIndex(e.target.value)}
              placeholder="0"
              min="0"
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
              {editIndex === -1 ? "Save Product" : "Update Product"}
            </Button>
            {editIndex !== -1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                className={cn("px-6 h-11")}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
