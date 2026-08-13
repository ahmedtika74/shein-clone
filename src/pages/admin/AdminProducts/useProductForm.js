import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  createProductThunk,
  updateProductThunk,
} from "../../../store/dataSlice";

const emptyForm = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  price: "",
  oldPrice: "",
  categoryId: "",
  offerId: "",
  offerBadge: "",
  mainIndex: 0,
  images: [],
  colors: [],
  sizes: [],
  variantsStock: {},
};

const newColor = () => ({
  nameEn: "",
  nameAr: "",
  hex: "#000000",
  imageUrl: "",
  price: "",
});

const newSize = () => ({ name: "", priceAdjustment: 0 });

export const useProductForm = (products, onSuccess) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("admin");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const setField = (field) => (value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const updateListItem = (field, index, patch) =>
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));

  const removeListItem = (field, index) =>
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, i) => i !== index),
    }));

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrorMessage("");
  };

  const handleEdit = (index) => {
    const product = products[index];
    if (!product) return;

    setEditingId(product.id);
    setForm({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      price: String(product.price ?? ""),
      oldPrice: product.oldPrice == null ? "" : String(product.oldPrice),
      // The select is keyed by id; the API also returns the name, which would
      // silently reassign the product to category 1 when saved.
      categoryId: product.categoryId == null ? "" : String(product.categoryId),
      offerId: product.offerId == null ? "" : String(product.offerId),
      offerBadge: product.offerBadge ?? "",
      mainIndex: product.mainIndex,
      images: [...product.images],
      colors: product.colors.map((color) => ({
        nameEn: color.nameEn ?? "",
        nameAr: color.nameAr ?? "",
        hex: color.hex || "#000000",
        imageUrl: color.imageUrl ?? "",
        price: color.price == null ? "" : String(color.price),
      })),
      sizes: product.sizes.map((size) => ({
        name: size.name ?? "",
        priceAdjustment: size.priceAdjustment ?? 0,
      })),
      variantsStock: { ...product.variantsStock },
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.nameEn || !form.nameAr || !form.price) {
      setErrorMessage(t("requiredFieldsMissing"));
      return;
    }
    if (!form.categoryId) {
      setErrorMessage(t("selectCategory"));
      return;
    }

    try {
      await dispatch(
        editingId === null
          ? createProductThunk(form)
          : updateProductThunk({ id: editingId, ...form }),
      ).unwrap();

      resetForm();
      setShowSuccess(true);
      onSuccess?.();
      setTimeout(() => setShowSuccess(false), 3000);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(error || t("saveFailed"));
    }
  };

  return {
    form,
    setField,
    isEditing: editingId !== null,
    errorMessage,
    showSuccess,
    resetForm,
    handleEdit,
    handleSave,

    addColor: () => setField("colors")([...form.colors, newColor()]),
    removeColor: (index) => removeListItem("colors", index),
    changeColor: (index, field, value) =>
      updateListItem("colors", index, { [field]: value }),

    addSize: () => setField("sizes")([...form.sizes, newSize()]),
    removeSize: (index) => removeListItem("sizes", index),
    changeSize: (index, field, value) =>
      updateListItem("sizes", index, { [field]: value }),

    changeVariantStock: (variantKey, value) =>
      setField("variantsStock")({ ...form.variantsStock, [variantKey]: value }),
  };
};
