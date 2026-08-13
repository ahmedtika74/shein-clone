import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { SEO } from "../../components/common/SEO";
import { Button, Input } from "../../components/ui";
import {
  selectSiteSettings,
  submitContactMessageThunk,
} from "../../store/dataSlice";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const ContactPage = () => {
  const { t } = useTranslation(["storefront", "common"]);
  const dispatch = useDispatch();
  const siteSettings = useSelector(selectSiteSettings);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);
    try {
      await dispatch(submitContactMessageThunk(form)).unwrap();
      setForm(emptyForm);
      setSuccess(true);
    } catch (err) {
      setError(err || t("contactSendFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "max-w-2xl mx-auto px-4 py-10 sm:py-14 pb-28 md:pb-14 w-full",
      )}
    >
      <SEO title={t("contactUs")} />

      <div className={cn("mb-8 text-center")}>
        <h1 className={cn("text-3xl font-bold text-gray-900 mb-2")}>
          {t("contactUs")}
        </h1>
        <p className={cn("text-gray-500 text-sm")}>
          {t("contactIntro", { site: siteSettings.siteName || t("store") })}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm space-y-4",
        )}
      >
        <Input
          label={t("fullName")}
          value={form.name}
          onChange={setField("name")}
          required
          autoComplete="name"
        />
        <Input
          label={t("email")}
          type="email"
          value={form.email}
          onChange={setField("email")}
          required
          autoComplete="email"
        />
        <Input
          label={`${t("phone")} (${t("optional")})`}
          type="tel"
          value={form.phone}
          onChange={setField("phone")}
          autoComplete="tel"
        />
        <Input
          label={t("contactSubject")}
          value={form.subject}
          onChange={setField("subject")}
          required
        />
        <div className={cn("flex flex-col gap-1")}>
          <label
            htmlFor="contact-message"
            className={cn("block text-xs font-bold text-gray-700 uppercase")}
          >
            {t("contactMessage")}
          </label>
          <textarea
            id="contact-message"
            required
            rows={6}
            value={form.message}
            onChange={setField("message")}
            placeholder={t("contactMessagePlaceholder")}
            className={cn(
              "w-full min-h-[140px] p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-black focus:ring-1 focus:ring-black resize-y",
            )}
          />
        </div>

        {error && (
          <p className={cn("text-sm text-red-600 font-medium")}>{error}</p>
        )}
        {success && (
          <p className={cn("text-sm text-green-600 font-medium")}>
            {t("contactSendSuccess")}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className={cn("w-full h-12")}
        >
          {submitting ? t("sending") : t("sendMessage")}
        </Button>
      </form>
    </div>
  );
};
