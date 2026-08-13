import { cn } from "../../../utils/cn";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProducts,
  selectCategories,
  deleteProductThunk,
} from "../../../store/dataSlice";

import { useProductForm } from "./useProductForm";
import { ProductsTable } from "./ProductsTable";
import { ProductForm } from "./ProductForm";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../components/ui/Modal";
import { useState } from "react";

export const AdminProductsPage = () => {
  const { t } = useTranslation(["admin", "common"]);
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const status = useSelector((state) => state.data.status);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const form = useProductForm(products, () => setIsModalOpen(false));

  const handleEdit = (product) => {
    const idx = products.findIndex((p) => String(p.id) === String(product.id));
    if (idx !== -1) {
      form.handleEdit(idx);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProductThunk(productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center mb-8",
        )}
      >
        <h1 className={cn("text-3xl font-bold text-gray-900")}>
          {t("manageProducts")}
        </h1>
        <button
          onClick={() => {
            form.resetForm();
            setIsModalOpen(true);
          }}
          className={cn(
            "bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e60023] transition-colors",
          )}
        >
          {t("addNewProduct")}
        </button>
      </div>

      {form.showSuccess && (
        <div
          className={cn(
            "mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative",
          )}
          role="alert"
        >
          <strong className={cn("font-bold")}>{t("success")}</strong>
          <span className={cn("block sm:inline")}>{t("productSaved")}</span>
        </div>
      )}

      {status === "loading" && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-[#e60023] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <ProductsTable
        products={products}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.resetForm();
        }}
        title={form.isEditing ? t("editProduct") : t("addProduct")}
        maxWidth="max-w-4xl"
      >
        <div className="max-h-[80vh] overflow-y-auto px-1">
          <ProductForm
            {...form}
            categories={categories}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        title={t("confirmDelete", { defaultValue: "Confirm Delete" })}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-6">
          <p className="text-gray-600 text-sm">
            {t("deleteConfirmProduct", {
              defaultValue: "Are you sure you want to delete this product?",
            })}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
              }}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("cancel", { defaultValue: "Cancel" })}
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("delete", { defaultValue: "Delete" })}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
