import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  formatProductData,
  createProductThunk,
  updateProductThunk,
} from "../../../store/dataSlice";

export const useProductForm = (products, onSuccess) => {
  const dispatch = useDispatch();

  const [editIndex, setEditIndex] = useState(-1);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [mainIndex, setMainIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState("");
  const [imagesBase64, setImagesBase64] = useState([]);
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");
  const [showSuccess, setShowSuccess] = useState(false);
  const [variantsStock, setVariantsStock] = useState({});

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then((results) => {
      setImagesBase64((prev) => [...prev, ...results]);
    });
  };

  const handleAddUrl = () => {
    if (imageInputUrl.trim()) {
      setImagesBase64((prev) => [...prev, imageInputUrl.trim()]);
      setImageInputUrl("");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const p = products[index];
    setNameEn(p.nameEn || "");
    setNameAr(p.nameAr || "");
    setDescriptionEn(p.descriptionEn || "");
    setDescriptionAr(p.descriptionAr || "");
    setNewPrice(p.newPrice || "");
    setOldPrice(p.oldPrice || "");
    setMainIndex(p.mainIndex || 0);
    setSelectedColors(
      Array.isArray(p.colors)
        ? p.colors.map((c) =>
            typeof c === "string"
              ? { nameEn: c, nameAr: c, hex: "", image: "", price: "" }
              : { ...c, price: c.price || "" },
          )
        : [],
    );
    setSelectedSizes(
      Array.isArray(p.sizes)
        ? p.sizes.map((s) =>
            typeof s === "string"
              ? { name: s, priceAdjustment: 0 }
              : { ...s, priceAdjustment: s.priceAdjustment || 0 },
          )
        : [],
    );
    setCategory(p.category || "");
    setOffer(p.offer || "");
    setImagesBase64(p.images || [p.img || ""]);
    setVariantsStock(p.variantsStock || {});
  };

  const handleAddColor = () => {
    setSelectedColors([
      ...selectedColors,
      { nameEn: "", nameAr: "", hex: "#000000", image: "", price: "" },
    ]);
  };

  const handleRemoveColor = (idx) => {
    setSelectedColors(selectedColors.filter((_, i) => i !== idx));
  };

  const handleColorChange = (idx, field, value) => {
    const updated = [...selectedColors];
    updated[idx] = { ...updated[idx], [field]: value };
    setSelectedColors(updated);
  };

  const handleAddSize = () => {
    setSelectedSizes([...selectedSizes, { name: "", priceAdjustment: 0 }]);
  };

  const handleRemoveSize = (idx) => {
    setSelectedSizes(selectedSizes.filter((_, i) => i !== idx));
  };

  const handleSizeChange = (idx, field, value) => {
    const updated = [...selectedSizes];
    updated[idx] = { ...updated[idx], [field]: value };
    setSelectedSizes(updated);
  };

  const handleVariantStockChange = (variantKey, value) => {
    setVariantsStock((prev) => ({
      ...prev,
      [variantKey]: value,
    }));
  };

  const resetForm = () => {
    setEditIndex(-1);
    setNameEn("");
    setNameAr("");
    setDescriptionEn("");
    setDescriptionAr("");
    setNewPrice("");
    setOldPrice("");
    setMainIndex(0);
    setSelectedColors([]);
    setSelectedSizes([]);
    setCategory("");
    setOffer("");
    setImagesBase64([]);
    setImageInputUrl("");
    setVariantsStock({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!nameEn || !nameAr || !newPrice) {
      alert("Both English and Arabic Names and Price are required.");
      return;
    }

    const unformattedData = {
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      newPrice,
      oldPrice,
      images: imagesBase64.length > 0 ? imagesBase64 : ["/images/top.jpg"],
      mainIndex: Number(mainIndex) || 0,
      colors:
        selectedColors.length > 0
          ? selectedColors.map((c) => ({
              ...c,
              price: c.price ? Number(c.price) : null,
            }))
          : [
              {
                nameEn: "Default",
                nameAr: "Default",
                hex: "",
                image: "",
                price: null,
              },
            ],
      sizes:
        selectedSizes.length > 0
          ? selectedSizes.map((s) => ({
              ...s,
              priceAdjustment: Number(s.priceAdjustment) || 0,
            }))
          : [{ name: "Free Size", priceAdjustment: 0 }],
      category: category || "General",
      offer,
      variantsStock,
    };

    const formattedProduct = formatProductData(
      unformattedData,
      editIndex,
      products,
    );

    if (editIndex === -1) {
      dispatch(createProductThunk(formattedProduct));
    } else {
      dispatch(updateProductThunk(formattedProduct));
    }

    resetForm();
    setShowSuccess(true);
    if (onSuccess) onSuccess();
    setTimeout(() => setShowSuccess(false), 3000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
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
    showSuccess,
    setShowSuccess,
    variantsStock,
    handleVariantStockChange,
    handleFileUpload,
    handleAddUrl,
    handleEdit,
    handleAddColor,
    handleRemoveColor,
    handleColorChange,
    handleAddSize,
    handleRemoveSize,
    handleSizeChange,
    resetForm,
    handleSave,
  };
};
