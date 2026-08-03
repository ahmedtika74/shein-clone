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

export const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const status = useSelector((state) => state.data.status);

  const form = useProductForm(products);

  return (
    <div>
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center mb-8",
        )}
      >
        <h1 className={cn("text-3xl font-bold text-gray-900")}>
          Manage Products
        </h1>
        <button
          onClick={() => {
            form.resetForm();
            document
              .querySelector(".form-container")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e60023] transition-colors",
          )}
        >
          + Add New Product
        </button>
      </div>

      {form.showSuccess && (
        <div
          className={cn(
            "mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative",
          )}
          role="alert"
        >
          <strong className={cn("font-bold")}>Success! </strong>
          <span className={cn("block sm:inline")}>
            Product saved successfully.
          </span>
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
        onEdit={form.handleEdit}
        onDelete={(index) => dispatch(deleteProductThunk(products[index].id))}
      />

      <ProductForm {...form} categories={categories} />
    </div>
  );
};
