import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { Input, Button } from "../../components/ui";
import { ImageUrlField } from "../../components/admin/ImageUrlField";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { MediaUsageCategory } from "../../services/mediaUpload";
import {
  fetchReturnsPageThunk,
  updateReturnsPageThunk,
} from "../../store/dataSlice";
import { emptyReturnsPage } from "../../services/mappers";

export const AdminReturnsPage = () => {
  const { t } = useTranslation(["admin", "common"]);
  const dispatch = useDispatch();

  const [form, setForm] = useState(emptyReturnsPage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    dispatch(fetchReturnsPageThunk())
      .unwrap()
      .then((data) => {
        if (!cancelled) setForm({ ...emptyReturnsPage, ...data });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err || t("failedToLoadReturns"));
          setForm(emptyReturnsPage);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, t]);

  const setField = (key) => (eventOrValue) => {
    const value =
      eventOrValue && typeof eventOrValue === "object" && "target" in eventOrValue
        ? eventOrValue.target.value
        : eventOrValue;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaveMessage("");
    try {
      await dispatch(updateReturnsPageThunk(form)).unwrap();
      setSaveMessage(t("returnsSaved"));
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setError(err || t("failedToSaveReturns"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={cn("max-w-3xl")}>
      <h1 className={cn("text-2xl font-bold text-gray-900 mb-2")}>
        {t("returns")}
      </h1>
      <p className={cn("text-sm text-gray-500 mb-6")}>{t("returnsPageHint")}</p>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-5",
        )}
      >
        <Input
          label={t("titleEn")}
          value={form.titleEn}
          onChange={setField("titleEn")}
          placeholder={t("returnsTitlePlaceholderEn")}
          required
        />
        <Input
          label={t("titleAr")}
          value={form.titleAr}
          onChange={setField("titleAr")}
          placeholder={t("returnsTitlePlaceholderAr")}
          required
        />

        <div className={cn("flex flex-col gap-2")}>
          <label
            htmlFor="returns-content-en"
            className={cn("font-bold text-sm text-gray-800")}
          >
            {t("contentEn")}
          </label>
          <textarea
            id="returns-content-en"
            rows={8}
            required
            value={form.contentEn}
            onChange={setField("contentEn")}
            placeholder={t("returnsContentPlaceholderEn")}
            className={cn(
              "w-full min-h-[160px] px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#e60023] text-sm resize-y",
            )}
          />
        </div>

        <div className={cn("flex flex-col gap-2")}>
          <label
            htmlFor="returns-content-ar"
            className={cn("font-bold text-sm text-gray-800")}
          >
            {t("contentAr")}
          </label>
          <textarea
            id="returns-content-ar"
            rows={8}
            required
            dir="rtl"
            value={form.contentAr}
            onChange={setField("contentAr")}
            placeholder={t("returnsContentPlaceholderAr")}
            className={cn(
              "w-full min-h-[160px] px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#e60023] text-sm resize-y",
            )}
          />
        </div>

        <ImageUrlField
          label={t("returnsImageOptional")}
          value={form.imageUrl}
          onChange={setField("imageUrl")}
          usageCategory={MediaUsageCategory.Other}
        />

        {error && (
          <p className={cn("text-sm text-red-600 font-medium")}>{error}</p>
        )}

        <div className={cn("pt-2 flex flex-wrap items-center gap-4")}>
          <Button
            type="submit"
            disabled={saving}
            className={cn("h-11 px-6 bg-[#e60023] hover:bg-red-700")}
          >
            {saving ? t("saving") : t("saveReturns")}
          </Button>
          {saveMessage && (
            <span className={cn("text-green-600 font-medium text-sm")}>
              {saveMessage}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
