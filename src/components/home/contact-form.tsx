"use client";

import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { HttpCat } from "@/components/http-cat";

type FormStatus = "idle" | "sending" | "success" | "error";

const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, "home.contact.errorNameTooShort")
    .max(100, "home.contact.errorNameTooLong"),
  lastName: z
    .string()
    .min(2, "home.contact.errorNameTooShort")
    .max(100, "home.contact.errorNameTooLong"),
  email: z
    .string()
    .email("home.contact.errorEmailInvalid")
    .max(254, "home.contact.errorEmailTooLong"),
  subject: z
    .string()
    .min(2, "home.contact.errorSubjectTooShort")
    .max(200, "home.contact.errorSubjectTooLong"),
  message: z
    .string()
    .min(10, "home.contact.errorMessageTooShort")
    .max(5000, "home.contact.errorMessageTooLong"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const STATUS_RESET_MS = 4000;

const inputStyles =
  "w-full border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40";
const labelStyles = "block text-sm text-foreground";
const requiredStyles = "text-muted-foreground";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const { t } = useLanguage();

  const resetStatus = () => setTimeout(() => setStatus("idle"), STATUS_RESET_MS);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setFieldErrors({
        firstName: flat.firstName?.[0],
        lastName: flat.lastName?.[0],
        email: flat.email?.[0],
        subject: flat.subject?.[0],
        message: flat.message?.[0],
      });
      return;
    }

    setStatus("sending");

    try {
      if (
        !userConfig.contact.formspree ||
        userConfig.contact.formspree.trim() === ""
      ) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus("success");
        form.reset();
        resetStatus();
        return;
      }

      const res = await fetch(userConfig.contact.formspree, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...result.data,
          name: `${result.data.firstName} ${result.data.lastName}`.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      form.reset();
      resetStatus();
    } catch {
      setStatus("error");
      resetStatus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <span className={labelStyles}>{t("home.contact.name")}</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className={`${labelStyles} text-xs`}>
              {t("home.contact.firstName")}{" "}
              <span className={requiredStyles}>{t("home.contact.required")}</span>
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              aria-invalid={fieldErrors.firstName ? "true" : undefined}
              aria-describedby={
                fieldErrors.firstName ? "firstName-error" : undefined
              }
              className={inputStyles}
              placeholder={t("home.contact.firstNamePlaceholder")}
            />
            {fieldErrors.firstName && (
              <p id="firstName-error" className="text-sm text-destructive">
                {t(fieldErrors.firstName)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className={`${labelStyles} text-xs`}>
              {t("home.contact.lastName")}{" "}
              <span className={requiredStyles}>{t("home.contact.required")}</span>
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
              aria-invalid={fieldErrors.lastName ? "true" : undefined}
              aria-describedby={
                fieldErrors.lastName ? "lastName-error" : undefined
              }
              className={inputStyles}
              placeholder={t("home.contact.lastNamePlaceholder")}
            />
            {fieldErrors.lastName && (
              <p id="lastName-error" className="text-sm text-destructive">
                {t(fieldErrors.lastName)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className={labelStyles}>
          {t("home.contact.email")}{" "}
          <span className={requiredStyles}>{t("home.contact.required")}</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-invalid={fieldErrors.email ? "true" : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className={inputStyles}
          placeholder={t("home.contact.emailPlaceholder")}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {t(fieldErrors.email)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className={labelStyles}>
          {t("home.contact.subject")}{" "}
          <span className={requiredStyles}>{t("home.contact.required")}</span>
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          required
          aria-invalid={fieldErrors.subject ? "true" : undefined}
          aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
          className={inputStyles}
        />
        {fieldErrors.subject && (
          <p id="subject-error" className="text-sm text-destructive">
            {t(fieldErrors.subject)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={labelStyles}>
          {t("home.contact.message")}{" "}
          <span className={requiredStyles}>{t("home.contact.required")}</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={fieldErrors.message ? "true" : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={`${inputStyles} resize-y`}
          placeholder={t("home.contact.messagePlaceholder")}
        />
        {fieldErrors.message && (
          <p id="message-error" className="text-sm text-destructive">
            {t(fieldErrors.message)}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-[48px] items-center gap-2 bg-foreground px-8 text-xs font-medium uppercase tracking-[0.12em] text-background transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("home.contact.sending")}
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              {t("home.contact.sent")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t("home.contact.send")}
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-3">
          <HttpCat status={422} className="max-w-[72px]" />
          <p className="text-sm text-destructive">{t("home.contact.error")}</p>
        </div>
      )}
    </form>
  );
}
